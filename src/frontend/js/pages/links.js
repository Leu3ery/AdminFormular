/* js/pages/links.js
   ────────────────────────────────────────────────────────────
   «Admins ↔ Locations» (доступно лише superAdmin‑ам)
   • Select admin → показує всі локації, з якими він пов’язаний
   • Можна додати (`POST /admin/{aid}/location/{lid}`) або
     видалити (`DELETE /admin/{aid}/location/{lid}`) зв’язок
   ──────────────────────────────────────────────────────────── */

   import { api } from "../api.js";
   import { showToast } from "../components/toast.js";
   
   export async function render(container /*HTMLElement*/) {
     /* ─────────────  DOM scaffold  ───────────── */
     container.innerHTML = `
       <h3 class="mb-3">Admin ↔ Location links</h3>
   
       <div class="row g-3 align-items-end mb-4">
         <div class="col-md-4">
           <label class="form-label">Admin</label>
           <select id="adminSelect" class="form-select"></select>
         </div>
   
         <div class="col-md-4">
           <label class="form-label">Location to link</label>
           <select id="locSelect" class="form-select"></select>
         </div>
   
         <div class="col-md-2 d-grid">
           <button class="btn btn-primary" id="linkBtn">Link</button>
         </div>
       </div>
   
       <div class="table-responsive">
         <table class="table table-hover align-middle" id="linksTable">
           <thead>
             <tr>
               <th>ID</th>
               <th>Address</th>
               <th>City</th>
               <th>Postcode</th>
               <th style="width:100px"></th>
             </tr>
           </thead>
           <tbody></tbody>
         </table>
       </div>
     `;
   
     const adminSel  = container.querySelector("#adminSelect");
     const locSel    = container.querySelector("#locSelect");
     const linkBtn   = container.querySelector("#linkBtn");
     const tbody     = container.querySelector("#linksTable tbody");
   
     /* ─────────────  state  ───────────── */
     let admins    = [];
     let locations = [];
     let links     = [];    // current admin's locations
     let currentAid = null;
   
     /* ─────────────  init  ───────────── */
     await Promise.all([loadAdmins(), loadLocations()]);
     if (admins.length) {
       currentAid = admins[0].id;
       adminSel.value = currentAid;
       await loadLinks();
     }
   
     /* ─────────────  fills  ───────────── */
     async function loadAdmins() {
       try {
         admins = await api.get("/admin/list");
         adminSel.innerHTML = admins.map((a) =>
           `<option value="${a.id}">${a.username}${a.isSuperAdmin ? " (S)" : ""}</option>`
         ).join("");
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     async function loadLocations() {
       try {
         locations = await api.get("/location/list");
         locSel.innerHTML = locations.map((l) =>
           `<option value="${l.id}">${l.address} — ${l.city}</option>`
         ).join("");
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     async function loadLinks() {
       if (!currentAid) return;
       try {
         const res = await api.get(`/admin/${currentAid}/location`);
         links = res;
         renderTable();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     /* ─────────────  render table  ───────────── */
     function renderTable() {
       const rows = links.map((l) => `
         <tr data-lid="${l.id}">
           <td>${l.id}</td>
           <td>${l.address}</td>
           <td>${l.city}</td>
           <td>${l.postcode}</td>
           <td>
             <button class="btn btn-outline-danger btn-sm unlinkBtn">Unlink</button>
           </td>
         </tr>`).join("");
   
       tbody.innerHTML = rows || `<tr><td colspan="5" class="text-center py-4">No links</td></tr>`;
       updateLocSelectDisabled();
     }
   
     /* disable already‑linked items in location dropdown */
     function updateLocSelectDisabled() {
       const linkedIds = new Set(links.map((l) => l.id));
       Array.from(locSel.options).forEach(
         (opt) => (opt.disabled = linkedIds.has(+opt.value))
       );
     }
   
     /* ─────────────  event listeners  ───────────── */
     adminSel.addEventListener("change", async () => {
       currentAid = +adminSel.value;
       await loadLinks();
     });
   
     linkBtn.addEventListener("click", async () => {
       const lid = +locSel.value;
       if (!currentAid || !lid) return;
       try {
         await api.post(`/admin/${currentAid}/location/${lid}`);
         showToast("Linked", "success");
         await loadLinks();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     tbody.addEventListener("click", async (e) => {
       if (!e.target.classList.contains("unlinkBtn")) return;
       const tr  = e.target.closest("tr");
       const lid = +tr.dataset.lid;
       if (!confirm("Remove link?")) return;
       try {
         await api.del(`/admin/${currentAid}/location/${lid}`);
         showToast("Unlinked", "success");
         await loadLinks();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     /* ─────────────  cleanup on page‑switch  ───────────── */
     const listeners = [adminSel, locSel, linkBtn, tbody];
     return () => listeners.forEach((el) => el.replaceWith(el.cloneNode(true)));
   }

   