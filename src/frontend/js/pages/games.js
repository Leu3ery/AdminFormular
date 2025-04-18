/* js/pages/games.js
   ────────────────────────────────────────────────────────────
   «Games» — вкладка для всіх адмінів
   • superAdmin  →  бачить усі локації
   • звичайний  →  бачить ТІЛЬКИ свої локації, але може обирати
   CRUD  /location/{locationId}/game(/:gameId)
   ──────────────────────────────────────────────────────────── */

   import { api, API_BASE } from "../api.js";
   import { showToast } from "../components/toast.js";
   
   export async function render(container, currentUser) {
     /* ─────────────  DOM scaffold  ───────────── */
     container.innerHTML = `
       <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
         <h3 class="m-0">Games</h3>
   
         <select id="locSelect" class="form-select w-auto d-none"></select>
   
         <button class="btn btn-primary ms-auto" id="addBtn">
           <i class="bi bi-plus-lg me-1"></i>Add game
         </button>
       </div>
   
       <div class="table-responsive">
         <table class="table table-hover align-middle" id="gamesTable">
           <thead>
             <tr>
               <th>ID</th>
               <th>Icon</th>
               <th>Name</th>
               <th>Color</th>
               <th>Max players</th>
               <th style="width:120px"></th>
             </tr>
           </thead>
           <tbody></tbody>
         </table>
       </div>
   
       <!-- CRUD modal -->
       <div class="modal fade" id="gameModal" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog">
           <div class="modal-content bg-dark border-secondary">
             <form id="gameForm">
               <div class="modal-header">
                 <h5 class="modal-title"></h5>
                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
               </div>
   
               <div class="modal-body">
                 <input type="hidden" name="id" />
                 <input type="hidden" name="LocationId" />
   
                 <div class="mb-3">
                   <label class="form-label">Name *</label>
                   <input type="text" name="name" class="form-control" required />
                 </div>
   
                 <div class="mb-3">
                   <label class="form-label">Color *</label>
                   <input type="text" name="color" class="form-control" placeholder="#112233" required pattern="^#[0-9a-fA-F]{6}$" />
                   <div class="form-text">Format #RRGGBB</div>
                 </div>
   
                 <div class="mb-3">
                   <label class="form-label">Max players *</label>
                   <input type="number" name="maxPlayers" class="form-control" min="1" required />
                 </div>
   
                 <div class="mb-3">
                   <label class="form-label">Icon <span class="text-danger">*</span></label>
                   <input type="file" name="file" accept="image/*" class="form-control" />
                   <div class="mt-3">
                     <img id="iconPreview" class="img-preview d-none" />
                   </div>
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
   
     const tbody         = container.querySelector("tbody");
     const addBtn        = container.querySelector("#addBtn");
     const locSelect     = container.querySelector("#locSelect");
     const modalEl       = container.querySelector("#gameModal");
     const modal         = new bootstrap.Modal(modalEl);
     const form          = modalEl.querySelector("#gameForm");
     const modalTitle    = modalEl.querySelector(".modal-title");
     const iconInput     = form.file;
     const iconPreview   = modalEl.querySelector("#iconPreview");
   
     /* ─────────────  state  ───────────── */
     let locations  = [];
     let games      = [];
     let currentLid = null;
   
     /* ─────────────  fetch locations  ───────────── */
     try {
       if (currentUser.isSuperAdmin) {
         locations = await api.get("/location/list");
       } else {
         locations = await api.get("/admin/location");
       }
     } catch (err) {
       showToast(err.message, "danger");
       return;
     }
   
     if (locations.length === 0) {
       tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No locations available</td></tr>`;
       addBtn.disabled = true;
       return;
     }
   
     /* populate selector (показуємо навіть для одного елементу, але disable) */
     locSelect.innerHTML = locations
       .map((l) => `<option value="${l.id}">${l.address} — ${l.city}</option>`)
       .join("");
   
     locSelect.classList.remove("d-none");
     if (locations.length === 1) locSelect.disabled = true;
   
     currentLid = +locSelect.value;
     await loadGames();
   
     /* ─────────────  helpers  ───────────── */
     async function loadGames() {
       try {
         games = await api.get(`/location/${currentLid}/game`);
         renderTable();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     function renderTable() {
       const rows = games.map((g) => `
         <tr data-id="${g.id}">
           <td>${g.id}</td>
           <td><img src="${API_BASE.replace("/api", "")}/public/${g.icon}" width="48" class="rounded" /></td>
           <td>${g.name}</td>
           <td><span class="badge rounded-pill" style="background-color:${g.color}">${g.color}</span></td>
           <td>${g.maxPlayers}</td>
           <td>
             <div class="btn-group btn-group-sm">
               <button class="btn btn-outline-light editBtn">Edit</button>
               <button class="btn btn-outline-danger deleteBtn">Del</button>
             </div>
           </td>
         </tr>`).join("");
   
       tbody.innerHTML = rows || `<tr><td colspan="6" class="text-center py-4">No games</td></tr>`;
     }
   
     /* ─────────────  modal helpers  ───────────── */
     function openCreate() {
       modalTitle.textContent = "Create game";
       form.reset();
       form.id.value = "";
       form.LocationId.value = currentLid;
       iconPreview.classList.add("d-none");
       iconPreview.src = "";
       iconInput.required = true;
       modal.show();
     }
   
     function openEdit(game) {
       modalTitle.textContent = "Edit game";
       form.id.value         = game.id;
       form.LocationId.value = currentLid;
       form.name.value       = game.name;
       form.color.value      = game.color;
       form.maxPlayers.value = game.maxPlayers;
       iconInput.value       = "";
       iconInput.required    = false;
       iconPreview.src       = `${API_BASE.replace("/api", "")}/public/${game.icon}`;
       iconPreview.classList.remove("d-none");
       modal.show();
     }
   
     iconInput.addEventListener("change", () => {
       const file = iconInput.files?.[0];
       if (file) {
         iconPreview.src = URL.createObjectURL(file);
         iconPreview.classList.remove("d-none");
       }
     });
   
     /* ─────────────  events  ───────────── */
     addBtn.addEventListener("click", openCreate);
   
     tbody.addEventListener("click", (e) => {
       const tr   = e.target.closest("tr");
       const id   = +tr.dataset.id;
       const game = games.find((g) => g.id === id);
       if (!game) return;
   
       if (e.target.classList.contains("editBtn")) {
         openEdit(game);
       } else if (e.target.classList.contains("deleteBtn")) {
         deleteGame(game);
       }
     });
   
     locSelect.addEventListener("change", async () => {
       currentLid = +locSelect.value;
       await loadGames();
     });
   
     form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const fd = new FormData();
   
       fd.append(
         "data",
         JSON.stringify({
           name: form.name.value.trim(),
           color: form.color.value.trim(),
           maxPlayers: +form.maxPlayers.value,
         })
       );
   
       if (iconInput.files[0]) fd.append("file", iconInput.files[0]);
   
       const id = form.id.value;
       const isNew = !id;
   
       try {
         if (isNew) {
           await api.upload(`/location/${currentLid}/game`, fd);
           showToast("Game created", "success");
         } else {
           await api.upload(`/location/${currentLid}/game/${id}`, fd);
           showToast("Game updated", "success");
         }
         await loadGames();
         modal.hide();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     async function deleteGame(game) {
       if (!confirm(`Delete game "${game.name}"?`)) return;
       try {
         await api.del(`/location/${currentLid}/game/${game.id}`);
         showToast("Game deleted", "success");
         await loadGames();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     /* ─────────────  cleanup  ───────────── */
     const listeners = [addBtn, tbody, locSelect, iconInput];
     return () => {
       listeners.forEach((el) => el.replaceWith(el.cloneNode(true)));
       modal.dispose();
     };
   }
   