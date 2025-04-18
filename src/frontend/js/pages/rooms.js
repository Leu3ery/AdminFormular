/* js/pages/rooms.js
   Rooms CRUD + open/close + filters (status, limit) + Game preview
   ──────────────────────────────────────────────────────────── */

   import { api, API_BASE } from "../api.js";
   import { showToast } from "../components/toast.js";
   
   export async function render(container, currentUser) {
     /* ─────────────  Mark‑up  ───────────── */
     container.innerHTML = `
       <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
         <h3 class="m-0">Rooms</h3>
   
         <select id="locSelect" class="form-select w-auto d-none"></select>
   
         <!-- filters -->
         <select id="statusFilter" class="form-select w-auto">
           <option value="all">All</option>
           <option value="open">Open</option>
           <option value="closed">Closed</option>
         </select>
   
         <input
           id="limitInput"
           type="number"
           class="form-control w-auto"
           style="max-width:90px"
           min="1"
           placeholder="Limit"
         />
   
         <button class="btn btn-primary ms-auto" id="addBtn">
           <i class="bi bi-plus-lg me-1"></i>Add room
         </button>
       </div>
   
       <div class="table-responsive">
         <table class="table table-hover align-middle">
           <thead>
             <tr>
               <th>ID</th>
               <th>Code</th>
               <th style="min-width:200px">Game</th>
               <th>Game&nbsp;time</th>
               <th>Status</th>
               <th style="width:180px"></th>
             </tr>
           </thead>
           <tbody id="tbody"></tbody>
         </table>
       </div>
   
       <!-- modal -->
       <div class="modal fade" id="roomModal" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog">
           <div class="modal-content bg-dark border-secondary">
             <form id="roomForm">
               <div class="modal-header">
                 <h5 class="modal-title"></h5>
                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
               </div>
   
               <div class="modal-body">
                 <input type="hidden" name="id" />
   
                 <div class="mb-3">
                   <label class="form-label">Location *</label>
                   <select name="LocationId" class="form-select" required></select>
                 </div>
   
                 <div class="mb-3">
                   <label class="form-label">Game *</label>
                   <select name="GameId" class="form-select" required></select>
                 </div>
   
                 <div class="mb-3">
                   <label class="form-label">Game time (min)</label>
                   <input type="number" name="gameTime" class="form-control" min="0" />
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
   
     /* ─────────────  Refs  ───────────── */
     const tbody        = container.querySelector("#tbody");
     const addBtn       = container.querySelector("#addBtn");
     const locSelect    = container.querySelector("#locSelect");
     const statusFilter = container.querySelector("#statusFilter");
     const limitInput   = container.querySelector("#limitInput");
     const modalEl      = container.querySelector("#roomModal");
     const modal        = new bootstrap.Modal(modalEl);
     const form         = modalEl.querySelector("#roomForm");
     const modalTitle   = modalEl.querySelector(".modal-title");
     const locField     = form.LocationId;
     const gameField    = form.GameId;
   
     /* ─────────────  State  ───────────── */
     let locations  = [];
     let rooms      = [];
     let gamesMap   = new Map();    // GameId → game object
     let currentLid = null;
   
     /* ─────────────  Init locations  ───────────── */
     try {
       locations = currentUser.isSuperAdmin
         ? await api.get("/location/list")
         : await api.get("/admin/location");
     } catch (err) {
       showToast(err.message, "danger");
       return;
     }
   
     if (!locations.length) {
       tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No locations</td></tr>`;
       addBtn.disabled = true;
       return;
     }
   
     locSelect.innerHTML = locations
       .map((l) => `<option value="${l.id}">${l.address} — ${l.city}</option>`)
       .join("");
     locSelect.classList.remove("d-none");
     if (locations.length === 1) locSelect.disabled = true;
   
     currentLid = +locSelect.value;
   
     await loadRooms();       // таблиця + gamesMap
     await populateLocField(); // для модалки (select у формі)
   
     /* ─────────────  Helpers  ───────────── */
     async function loadRooms() {
       const qs = new URLSearchParams({ locationId: currentLid });
   
       if (statusFilter.value === "open")   qs.set("isActivate", "true");
       if (statusFilter.value === "closed") qs.set("isActivate", "false");
       if (limitInput.value) qs.set("limit", limitInput.value);
   
       try {
         /* тягнемо і rooms, і всі ігри цієї локації */
         const [roomsRes, gamesRes] = await Promise.all([
           api.get(`/room?${qs.toString()}`),
           api.get(`/location/${currentLid}/game`)
         ]);
   
         rooms    = roomsRes;
         gamesMap = new Map(gamesRes.map((g) => [g.id, g]));
   
         renderTable();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     function renderTable() {
       const rows = rooms.map((r) => {
         const g = gamesMap.get(r.GameId) || { name: `#${r.GameId}`, icon: "placeholder.png" };
         return `
           <tr data-id="${r.id}">
             <td>${r.id}</td>
             <td>${r.code ?? "-"}</td>
             <td class="d-flex align-items-center gap-2">
               <img src="${API_BASE.replace("/api", "")}/public/${g.icon}" width="32" class="rounded" />
               <span>${g.name}</span>
             </td>
             <td>${r.gameTime}</td>
             <td>
               ${r.isActivate
                 ? '<span class="badge bg-success">open</span>'
                 : '<span class="badge bg-secondary">closed</span>'}
             </td>
             <td>
               <div class="btn-group btn-group-sm">
                 <button class="btn btn-outline-light editBtn">Edit</button>
                 <button class="btn btn-outline-${r.isActivate ? "warning" : "success"} toggleBtn">
                   ${r.isActivate ? "Close" : "Open"}
                 </button>
                 <button class="btn btn-outline-danger deleteBtn">Del</button>
               </div>
             </td>
           </tr>`;
       }).join("");
   
       tbody.innerHTML = rows || `<tr><td colspan="6" class="text-center py-4">No rooms</td></tr>`;
     }
   
     /* заповнює селект локацій і одразу підтягує ігри для першого пункту */
     async function populateLocField() {
       locField.innerHTML = locSelect.innerHTML;
       locField.value = currentLid;
       await fillGames(+locField.value);
     }
   
     async function fillGames(lid) {
       gameField.innerHTML = `<option disabled selected>Loading…</option>`;
       try {
         const games = await api.get(`/location/${lid}/game`);
         gameField.innerHTML = games
           .map((g) => `<option value="${g.id}">${g.name}</option>`)
           .join("");
       } catch (err) {
         showToast(err.message, "danger");
         gameField.innerHTML = "";
       }
     }
   
     /* ─────────────  Modal helpers  ───────────── */
     function openCreate() {
       modalTitle.textContent = "Create room";
       form.reset();
       form.id.value = "";
       locField.disabled = false;
       populateLocField().then(() => modal.show());
     }
   
     function openEdit(room) {
       modalTitle.textContent = "Edit room";
       form.id.value = room.id;
       locField.value = room.LocationId;
       locField.disabled = true;
       fillGames(room.LocationId).then(() => {
         gameField.value = room.GameId;
         form.gameTime.value = room.gameTime;
         modal.show();
       });
     }
   
     /* ─────────────  CRUD events  ───────────── */
     addBtn.addEventListener("click", openCreate);
   
     tbody.addEventListener("click", (e) => {
       const tr   = e.target.closest("tr");
       const id   = +tr.dataset.id;
       const room = rooms.find((r) => r.id === id);
       if (!room) return;
   
       if (e.target.classList.contains("editBtn")) {
         openEdit(room);
       } else if (e.target.classList.contains("deleteBtn")) {
         deleteRoom(room);
       } else if (e.target.classList.contains("toggleBtn")) {
         toggleRoom(room);
       }
     });
   
     /* filters */
     [locSelect, statusFilter, limitInput].forEach((el) =>
       el.addEventListener("change", async () => {
         currentLid = +locSelect.value;
         await loadRooms();
       })
     );
   
     locField.addEventListener("change", () => fillGames(+locField.value));
   
     form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const payload = {
         LocationId: +form.LocationId.value,
         GameId:     +form.GameId.value
       };
       const id = form.id.value;
       if (form.gameTime.value) payload.gameTime = +form.gameTime.value;
   
       try {
         if (id) {
           await api.patch(`/room/${id}`, {
             gameId: payload.GameId,
             gameTime: payload.gameTime ?? undefined
           });
           showToast("Room updated", "success");
         } else {
           await api.post("/room", payload);
           showToast("Room created", "success");
         }
         await loadRooms();
         modal.hide();
       } catch (err) {
         showToast(err.message, "danger");
       }
     });
   
     async function deleteRoom(room) {
       if (!confirm(`Delete room #${room.id}?`)) return;
       try {
         await api.del(`/room/${room.id}`);
         showToast("Room deleted", "success");
         await loadRooms();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     async function toggleRoom(room) {
       const action = room.isActivate ? "close" : "open";
       try {
         await api.patch(`/room/${room.id}/${action}`);
         showToast(`Room ${action}d`, "success");
         await loadRooms();
       } catch (err) {
         showToast(err.message, "danger");
       }
     }
   
     /* ─────────────  cleanup  ───────────── */
     const listeners = [addBtn, tbody, locSelect, statusFilter, limitInput];
     return () => {
       listeners.forEach((el) => el.replaceWith(el.cloneNode(true)));
       modal.dispose();
     };
   }
   