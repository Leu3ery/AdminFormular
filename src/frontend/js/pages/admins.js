/* js/pages/admins.js
   ────────────────────────────────────────────────────────────
   CRUD‑інтерфейс «Admins» (доступний тільки superAdmin‑ам)
   Ендпоїнти:
     GET    /admin/list
     POST   /admin/register
     PUT    /admin/{id}
     DELETE /admin/{id}
   ──────────────────────────────────────────────────────────── */

   import { api } from "../api.js";
   import { showToast } from "../components/toast.js";
   
   export async function render(container /*HTMLElement*/, currentUser) {
     /* ─────────────  DOM scaffold  ───────────── */
     container.innerHTML = `
       <div class="d-flex justify-content-between align-items-center mb-3">
         <h3 class="m-0">Admins</h3>
         <button class="btn btn-primary" id="addBtn">
           <i class="bi bi-plus-lg me-1"></i>Add admin
         </button>
       </div>
   
       <div class="table-responsive">
         <table class="table table-hover align-middle" id="adminsTable">
           <thead>
             <tr>
               <th>ID</th>
               <th>Username</th>
               <th>First&nbsp;Name</th>
               <th>Last&nbsp;Name</th>
               <th class="text-center">Super</th>
               <th style="width:120px"></th>
             </tr>
           </thead>
           <tbody></tbody>
         </table>
       </div>
   
       <!-- CRUD modal -->
       <div class="modal fade" id="adminModal" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog">
           <div class="modal-content bg-dark border-secondary">
             <form id="adminForm">
               <div class="modal-header">
                 <h5 class="modal-title"></h5>
                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
               </div>
               <div class="modal-body">
                 <input type="hidden" name="id" />
                 <div class="mb-3">
                   <label class="form-label">Username *</label>
                   <input type="text" name="username" class="form-control" required minlength="3" maxlength="64">
                 </div>
                 <div class="mb-3">
                   <label class="form-label">First name</label>
                   <input type="text" name="firstName" class="form-control" minlength="3" maxlength="64">
                 </div>
                 <div class="mb-3">
                   <label class="form-label">Last name</label>
                   <input type="text" name="lastName" class="form-control" minlength="3" maxlength="64">
                 </div>
                 <div class="mb-3 password-field">
                   <label class="form-label">Password *</label>
                   <input type="password" name="password" class="form-control" minlength="3" maxlength="64" required>
                 </div>
                 <div class="form-text">
                   Super‑admins cannot be created from UI.
                 </div>
               </div>
               <div class="modal-footer">
                 <button type="submit" class="btn btn-primary">Save</button>
                 <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
               </div>
             </form>
           </div>
         </div>
       </div>
     `;
   
     const tbody     = container.querySelector("tbody");
     const addBtn    = container.querySelector("#addBtn");
     const modalEl   = container.querySelector("#adminModal");
     const modal     = new bootstrap.Modal(modalEl);
     const form      = modalEl.querySelector("#adminForm");
     const modalTitle= modalEl.querySelector(".modal-title");
     const passwordField = modalEl.querySelector(".password-field");
   
     /* ─────────────  state  ───────────── */
     let admins = [];
   
     /* ─────────────  load & render list  ───────────── */
     async function loadAdmins() {
       try {
         admins = await api.get("/admin/list");
         renderTable();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     function renderTable() {
       const rows = admins.map((a) => `
         <tr data-id="${a.id}">
           <td>${a.id}</td>
           <td>${a.username}</td>
           <td>${a.firstName ?? ""}</td>
           <td>${a.lastName ?? ""}</td>
           <td class="text-center">
             ${a.isSuperAdmin ? '<i class="bi bi-shield-lock-fill text-primary"></i>' : ""}
           </td>
           <td>
             <div class="btn-group btn-group-sm">
               <button class="btn btn-outline-light editBtn">Edit</button>
               <button class="btn btn-outline-danger deleteBtn">Del</button>
             </div>
           </td>
         </tr>`).join("");
   
       tbody.innerHTML = rows || `<tr><td colspan="6" class="text-center py-4">No admins found</td></tr>`;
     }
   
     /* ─────────────  open modal helpers  ───────────── */
     function openCreate() {
       modalTitle.textContent = "Create admin";
       form.reset();
       form.id.value = "";
       passwordField.classList.remove("d-none");
       modal.show();
     }
   
     function openEdit(admin) {
       modalTitle.textContent = "Edit admin";
       form.id.value        = admin.id;
       form.username.value  = admin.username;
       form.firstName.value = admin.firstName ?? "";
       form.lastName.value  = admin.lastName ?? "";
       form.password.value  = "";                   // blank → ignore
       passwordField.classList.add("d-none");       // hide password on edit
       modal.show();
     }
   
     /* ─────────────  event listeners  ───────────── */
     addBtn.addEventListener("click", openCreate);
   
     /* table delegation */
     tbody.addEventListener("click", (e) => {
       const tr   = e.target.closest("tr");
       const id   = Number(tr?.dataset.id);
       const admin= admins.find((a) => a.id === id);
       if (!admin) return;
   
       if (e.target.classList.contains("editBtn")) {
         openEdit(admin);
       } else if (e.target.classList.contains("deleteBtn")) {
         deleteAdmin(admin);
       }
     });
   
     /* create / update submit */
     form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const fd = new FormData(form);
       const payload = {
         username:  fd.get("username").trim(),
         firstName: fd.get("firstName").trim() || undefined,
         lastName:  fd.get("lastName").trim() || undefined
       };
   
       const id = fd.get("id");
       const isNew = !id;
   
       if (isNew) payload.password = fd.get("password");
   
       try {
         if (isNew) {
           await api.post("/admin/register", payload);
           showToast("Admin created", "success");
         } else {
           await api.put(`/admin/${id}`, payload);
           showToast("Admin updated", "success");
         }
         await loadAdmins();
         modal.hide();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     /* deletion */
     async function deleteAdmin(admin) {
       if (!confirm(`Delete admin "${admin.username}"?`)) return;
       try {
         await api.del(`/admin/${admin.id}`);
         showToast("Admin deleted", "success");
         await loadAdmins();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     /* ─────────────  start  ───────────── */
     await loadAdmins();
   
     /* ─────────────  cleanup on page‑switch  ───────────── */
     const listeners = [addBtn, tbody, form];
     return () => {
       listeners.forEach((el) => el.replaceWith(el.cloneNode(true))); // brute detach
       modal.dispose();
     };
   }
   