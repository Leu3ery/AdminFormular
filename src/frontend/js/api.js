/* js/api.js
   ------------------------------------------------------------
   Thin wrapper over fetch() for our VR‑Admin backend.
   • Adds JWT automatically (if it exists in localStorage)
   • Handles JSON → throwing ‘message’ from {"success":false,…}
   • Exports helpers:  api.get / post / put /del  +  token utils
   ------------------------------------------------------------ */

   const API_BASE = "http://localhost:8000/api";      // change if needed

   /* ───────────────────  token helpers  ─────────────────── */
   function getToken() {
     return localStorage.getItem("jwtToken");
   }
   
   function setToken(token) {
     if (token) {
       localStorage.setItem("jwtToken", token);
     } else {
       localStorage.removeItem("jwtToken");
     }
   }
   
   /* ───────────────────  core request  ─────────────────── */
   async function request(path, { method = "GET", body = null, headers = {} } = {}) {
     const url = `${API_BASE}${path}`;
     const token = getToken();
   
     const opts = {
       method,
       headers: {
         ...headers,
         ...(token && { Authorization: `Bearer ${token}` })
       }
     };
   
     if (body instanceof FormData) {
       // let browser set multipart boundary
       opts.body = body;
     } else if (body !== null) {
       opts.headers["Content-Type"] = "application/json";
       opts.body = JSON.stringify(body);
     }
   
     const response = await fetch(url, opts);
   
     let payload;
     try {
       payload = await response.json();
     } catch {
       throw new Error(`Server returned bad JSON (${response.status})`);
     }
   
     /* Backend convention: {success:boolean, message?:string, data?:any} */
     if (!response.ok || payload.success === false) {
       if (response.status === 401) setToken(null);      // auto‑logout on auth failure
       throw new Error(payload.message || `${response.status} ${response.statusText}`);
     }
   
     return payload.data ?? payload;                     // usually return .data
   }
   
   /* ───────────────────  verb helpers  ─────────────────── */
   export const api = {
     get:  (path)        => request(path),
     post: (path, body)  => request(path, { method: "POST", body }),
     put:  (path, body)  => request(path, { method: "PUT",  body }),
     del:  (path)        => request(path, { method: "DELETE" }),
     /* multipart upload (file + other fields wrapped in FormData) */
     upload: (path, formData) => request(path, { method: "POST", body: formData }),
   
     /* token utils re‑exported for auth.js */
     setToken,
     getToken
   };
   
   export { API_BASE };
   