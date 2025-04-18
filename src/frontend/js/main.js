/* js/main.js
   ────────────────────────────────────────────────────────────
   Entry‑point:  Bootstrap‑loaded as <script type="module">
   • Ініціалізує авторизацію
   • Керує вкладками <nav> та lazy‑імпортом page‑модулів
   • Стежить за зміною ролі (superAdmin / admin)
   ──────────────────────────────────────────────────────────── */

   import { initAuth, onAuthChange, getCurrentUser } from "./auth.js";
   import { showToast } from "./components/toast.js";
   
   /* ------------------------------------------------------------------
      DOM refs
      ------------------------------------------------------------------ */
   const pageContainer = document.getElementById("pageContainer");
   const navLinks      = Array.from(document.querySelectorAll('#navTabs .nav-link'));
   
   /* ------------------------------------------------------------------
      Simple client‑side router
      ------------------------------------------------------------------ */
   const pageCache = new Map();   // імпортовані модулі
   let cleanupFn   = null;        // destroy функція поточної сторінки
   let currentPage = null;
   
   /* активне посилання у navbar */
   function setActive(page) {
     navLinks.forEach((a) =>
       a.classList.toggle("active", a.dataset.page === page)
     );
   }
   
   /* основна навігація */
   async function navigateTo(page) {
     const user = getCurrentUser();
     if (!user) return;                 // ще не залогінилися
   
     /* звичайному адмінові — лише Games */
     if (!user.isSuperAdmin && page !== "games") {
       showToast("Access denied: super‑admin only", "danger");
       return;
     }
   
     if (currentPage === page) return;  // вже тут
   
     /* clean previous page (optional fn, повернена render) */
     if (typeof cleanupFn === "function") {
       try { cleanupFn(); } catch {}
       cleanupFn = null;
     }
   
     /* lazy import */
     let mod = pageCache.get(page);
     if (!mod) {
       try {
         mod = await import(`./pages/${page}.js`);
         pageCache.set(page, mod);
       } catch (err) {
         showToast(`Failed to load page "${page}"`, "danger");
         return;
       }
     }
   
     /* render */
     pageContainer.innerHTML = "";
     try {
       cleanupFn = await mod.render(pageContainer, user); // може повернути destroy()
       currentPage = page;
       setActive(page);
     } catch (err) {
       showToast(err.message, "danger");
     }
   }
   
   /* ------------------------------------------------------------------
      Navbar link handling
      ------------------------------------------------------------------ */
   navLinks.forEach((a) =>
     a.addEventListener("click", (e) => {
       e.preventDefault();
       navigateTo(a.dataset.page);
     })
   );
   
   /* ------------------------------------------------------------------
      Auth lifecycle
      ------------------------------------------------------------------ */
   onAuthChange((user) => {
     if (!user) {
       /* log‑out → почистити все */
       if (typeof cleanupFn === "function") cleanupFn();
       cleanupFn   = null;
       currentPage = null;
       pageContainer.innerHTML = "";
       setActive(null);
     } else {
       /* залогінились → перейти до дефолтної сторінки */
       navigateTo("games");
     }
   });
   
   /* ------------------------------------------------------------------
      Go!
      ------------------------------------------------------------------ */
   initAuth().catch((err) => showToast(err.message, "danger"));
   