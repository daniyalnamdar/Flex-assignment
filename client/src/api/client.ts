import axios from "axios";
axios.defaults.adapter = "xhr"; // prevents auto-cancellation in React 18 dev

const base =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3001") + "/";

export const api = axios.create({
  baseURL: base,
});
