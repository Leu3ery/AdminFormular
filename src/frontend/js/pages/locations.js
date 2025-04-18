/* js/pages/locations.js
   ────────────────────────────────────────────────────────────
   CRUD‑інтерфейс «Locations» (доступний лише superAdmin‑ам)
   Ендпоїнти:
     GET    /location/list
     POST   /location
     PUT    /location/{id}
     DELETE /location/{id}
   ──────────────────────────────────────────────────────────── */

   import { api } from "../api.js";
   import { showToast } from "../components/toast.js";
   
   export async function render(container /*HTMLElement*/, currentUser) {
     /* ─────────────  DOM scaffold  ───────────── */
     container.innerHTML = `
       <div class="d-flex justify-content-between align-items-center mb-3">
         <h3 class="m-0">Locations</h3>
         <button class="btn btn-primary" id="addBtn">
           <i class="bi bi-plus-lg me-1"></i>Add location
         </button>
       </div>
   
       <div class="table-responsive">
         <table class="table table-hover align-middle" id="locationsTable">
           <thead>
             <tr>
               <th>ID</th>
               <th>Address</th>
               <th>City</th>
               <th>Postcode</th>
               <th>Phone</th>
               <th>Mail</th>
               <th style="width:120px"></th>
             </tr>
           </thead>
           <tbody></tbody>
         </table>
       </div>
   
       <!-- CRUD modal -->
       <div class="modal fade" id="locModal" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog">
           <div class="modal-content bg-dark border-secondary">
             <form id="locForm">
               <div class="modal-header">
                 <h5 class="modal-title"></h5>
                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
               </div>
               <div class="modal-body">
                 <input type="hidden" name="id" />
                 <div class="mb-3">
                   <label class="form-label">Address *</label>
                   <input type="text" name="address" class="form-control" required />
                 </div>
                 <div class="mb-3">
                   <label class="form-label">City *</label>
                   <input type="text" name="city" class="form-control" required />
                 </div>
                 <div class="mb-3">
                   <label class="form-label">Postcode *</label>
                   <input type="text" name="postcode" class="form-control" required />
                 </div>
                 <div class="mb-3">
                   <label class="form-label">Phone *</label>
                   <input type="text" name="phone" class="form-control" required />
                 </div>
                 <div class="mb-3">
                   <label class="form-label">Mail *</label>
                   <input type="email" name="mail" class="form-control" required />
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
     const modalEl   = container.querySelector("#locModal");
     const modal     = new bootstrap.Modal(modalEl);
     const form      = modalEl.querySelector("#locForm");
     const modalTitle= modalEl.querySelector(".modal-title");
   
     /* ─────────────  state  ───────────── */
     let locations = [];
   
     /* ─────────────  load & render list  ───────────── */
     async function loadLocations() {
       try {
         locations = await api.get("/location/list");
         renderTable();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     function renderTable() {
       const rows = locations.map((l) => `
         <tr data-id="${l.id}">
           <td>${l.id}</td>
           <td>${l.address}</td>
           <td>${l.city}</td>
           <td>${l.postcode}</td>
           <td>${l.phone}</td>
           <td>${l.mail}</td>
           <td>
             <div class="btn-group btn-group-sm">
               <button class="btn btn-outline-light editBtn">Edit</button>
               <button class="btn btn-outline-danger deleteBtn">Del</button>
             </div>
           </td>
         </tr>`).join("");
   
       tbody.innerHTML = rows || `<tr><td colspan="7" class="text-center py-4">No locations found</td></tr>`;
     }
   
     /* ─────────────  open modal helpers  ───────────── */
     function openCreate() {
       modalTitle.textContent = "Create location";
       form.reset();
       form.id.value = "";
       modal.show();
     }
   
     function openEdit(loc) {
       modalTitle.textContent = "Edit location";
       form.id.value       = loc.id;
       form.address.value  = loc.address;
       form.city.value     = loc.city;
       form.postcode.value = loc.postcode;
       form.phone.value    = loc.phone;
       form.mail.value     = loc.mail;
       modal.show();
     }
   
     /* ─────────────  event listeners  ───────────── */
     addBtn.addEventListener("click", openCreate);
   
     tbody.addEventListener("click", (e) => {
       const tr  = e.target.closest("tr");
       const id  = Number(tr?.dataset.id);
       const loc = locations.find((l) => l.id === id);
       if (!loc) return;
   
       if (e.target.classList.contains("editBtn")) {
         openEdit(loc);
       } else if (e.target.classList.contains("deleteBtn")) {
         deleteLocation(loc);
       }
     });
   
     form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const fd = new FormData(form);
       const payload = {
         address:  fd.get("address").trim(),
         city:     fd.get("city").trim(),
         postcode: fd.get("postcode").trim(),
         phone:    fd.get("phone").trim(),
         mail:     fd.get("mail").trim()
       };
   
       const id = fd.get("id");
       const isNew = !id;
   
       try {
         if (isNew) {
           await api.post("/location", payload);
           showToast("Location created", "success");
         } else {
           await api.put(`/location/${id}`, payload);
           showToast("Location updated", "success");
         }
         await loadLocations();
         modal.hide();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     async function deleteLocation(loc) {
       if (!confirm(`Delete location "${loc.address}"?`)) return;
       try {
         await api.del(`/location/${loc.id}`);
         showToast("Location deleted", "success");
         await loadLocations();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     /* ─────────────  start  ───────────── */
     await loadLocations();
   
     /* ─────────────  cleanup on page‑switch  ───────────── */
     const listeners = [addBtn, tbody, form];
     return () => {
       listeners.forEach((el) => el.replaceWith(el.cloneNode(true))); // detach
       modal.dispose();
     };
   }
   