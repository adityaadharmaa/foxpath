import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY, // Ambil dari .env Laravel
  wsHost: import.meta.env.VITE_REVERB_HOST || "localhost",
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: false, // Set ke true jika sudah menggunakan HTTPS
  enabledTransports: ["ws", "wss"],
  authEndpoint: import.meta.env.VITE_API_BASE_URL + "/broadcasting/auth",
  auth: {
    headers: {
      get Authorization() {
        return `Bearer ${localStorage.getItem("token")}`;
      },
      Accept: "application/json",
    },
  },
  withCredentials: true,
});
