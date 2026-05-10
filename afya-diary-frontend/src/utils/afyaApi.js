import axios from "axios";

/**
 * Python FastAPI backend — AFYA voice AI, coaching, emergency, navigation
 * Base URL comes from REACT_APP_AI_URL in .env
 * Default: http://localhost:8080
 */
const afyaApi = axios.create({
  baseURL: process.env.REACT_APP_AI_URL || "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach session_id header if present in sessionStorage
afyaApi.interceptors.request.use(
  (config) => {
    const sessionId = sessionStorage.getItem("afya_session_id");
    if (sessionId) {
      config.headers["X-Session-ID"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default afyaApi;