/* js/components/toast.js
   ------------------------------------------------------------
   Tiny helper to show Bootstrap 5 toast notifications.
   Usage:   import { showToast } from "./components/toast.js";
            showToast("Saved successfully", "success");
   ------------------------------------------------------------ */

   let counter = 0;   // unique id generator
   const container = document.getElementById("toastContainer");
   
   /**
    * Show a toast message
    * @param {string}  message       — text content
    * @param {"info"|"success"|"warning"|"danger"} [type="info"]
    * @param {number}  [delay=4000]  — auto‑hide after ms (0 = sticky)
    */
   export function showToast(message, type = "info", delay = 4000) {
     if (!container) return console.warn("No #toastContainer found");
   
     const id = `toast-${++counter}`;
   
     /* toast element */
     const toastEl = document.createElement("div");
     toastEl.className = `toast align-items-center text-bg-${type} border-0`;
     toastEl.id = id;
     toastEl.role = "alert";
     toastEl.ariaLive = "assertive";
     toastEl.ariaAtomic = "true";
     toastEl.innerHTML = `
       <div class="d-flex">
         <div class="toast-body">${message}</div>
         <button
           type="button"
           class="btn-close btn-close-white me-2 m-auto"
           data-bs-dismiss="toast"
           aria-label="Close"
         ></button>
       </div>
     `;
   
     container.appendChild(toastEl);
   
     const toast = new bootstrap.Toast(toastEl, {
       autohide: delay > 0,
       delay
     });
   
     /* remove from DOM after hidden */
     toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
   
     toast.show();
   }
   