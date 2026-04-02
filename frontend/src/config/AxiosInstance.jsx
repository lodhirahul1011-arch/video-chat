// src/config/AxiosInstance.jsx

import axios from "axios";
import { store } from "../store/store";
import { removeUser } from "../features/reducers/AuthSlice";

// Prefer env, fallback to localhost for dev
const rawApiUrl =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

// Create Axios Instance
export const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,        // -> e.g. https://videochat-backend-bs92.onrender.com

  withCredentials: true,        // cookie bhejne/leneke liye IMPORTANT
  timeout: 30000,               // Render ke liye thoda zyada time
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// OPTIONAL: Request interceptor (abhi sirf pass-through)
AxiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor – 401 pe logout + redirect
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Redux se user hatao
      store.dispatch(removeUser(null));

      // Agar CMS ke andar ho to home pe bhej do
      if (window.location.pathname.startsWith("/cms")) {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);