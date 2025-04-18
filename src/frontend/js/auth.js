/* js/auth.js
   ------------------------------------------------------------
   Handles authentication flow for the VR‑Admin panel
   • Login modal (username / password → JWT)
   • Stores token in localStorage (delegated to api.js)
   • Fetches “/admin” to discover current user + role
   • Exposes helpers for main.js / page‑modules
   ------------------------------------------------------------ */

   import { api } from "./api.js";
   import { showToast } from "./components/toast.js";
   
   /* ------------------------------------------------------------------
      State
      ------------------------------------------------------------------ */
   let currentUser = null;                 // { username, firstName, …, isSuperAdmin }
   const subscribers = [];                 // callbacks fired on auth change
   
   export function getCurrentUser() {
     return currentUser;
   }
   
   function notifyAuthChange() {
     subscribers.forEach((cb) => cb(currentUser));
   }
   
   /* public: subscribe to auth changes */
   export function onAuthChange(cb) {
     if (typeof cb === "function") subscribers.push(cb);
   }
   
   /* ------------------------------------------------------------------
      UI elements
      ------------------------------------------------------------------ */
   const loginModalEl  = document.getElementById("loginModal");
   const loginForm     = document.getElementById("loginForm");
   const userNameLabel = document.getElementById("userName");
   const logoutBtn     = document.getElementById("logoutBtn");
   const navTabs       = document.querySelectorAll('[data-role="super"]');
   
   const loginModal = new bootstrap.Modal(loginModalEl, {
     backdrop: "static",
     keyboard: false
   });
   
   /* ------------------------------------------------------------------
      Init – call once from main.js
      ------------------------------------------------------------------ */
   export async function initAuth() {
     try {
       await fetchMe();          // token may already be in LS
     } catch {
       /* silent – will show modal below */
     } finally {
       updateUI();
     }
   
     if (!currentUser) loginModal.show();  // force login if no user
   }
   
   /* ------------------------------------------------------------------
      Login flow
      ------------------------------------------------------------------ */
   loginForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     const fd = new FormData(loginForm);
     const creds = {
       username: fd.get("username").trim(),
       password: fd.get("password")
     };
   
     if (!creds.username || !creds.password) return;
   
     /* disable inputs while processing */
     loginForm.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
   
     try {
       const { token } = await api.post("/admin/login", creds);
       api.setToken(token);
       await fetchMe();
       loginForm.reset();
       loginModal.hide();
       showToast("Logged in successfully", "success");
     } catch (err) {
       showToast(err.message, "danger");
     } finally {
       loginForm.querySelectorAll("input, button").forEach((el) => (el.disabled = false));
     }
   });
   
   /* ------------------------------------------------------------------
      Logout
      ------------------------------------------------------------------ */
   logoutBtn.addEventListener("click", () => {
     api.setToken(null);
     currentUser = null;
     updateUI();
     notifyAuthChange();
     loginModal.show();
   });
   
   /* ------------------------------------------------------------------
      Helpers
      ------------------------------------------------------------------ */
   async function fetchMe() {
     const me = await api.get("/admin");   // GET /admin → info by JWT
     currentUser = me;
     notifyAuthChange();
   }
   
   function updateUI() {
     /* show / hide super‑tabs */
     navTabs.forEach((li) => {
       if (currentUser?.isSuperAdmin) {
         li.classList.remove("d-none");
       } else {
         li.classList.add("d-none");
       }
     });
   
     /* name & logout button */
     if (currentUser) {
       userNameLabel.textContent =
         currentUser.firstName
           ? `${currentUser.firstName} ${currentUser.lastName ?? ""}`.trim()
           : currentUser.username;
   
       logoutBtn.classList.remove("d-none");
     } else {
       userNameLabel.textContent = "";
       logoutBtn.classList.add("d-none");
     }
   }
   