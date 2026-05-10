/**
 * AFYA AI Service
 *
 * REST calls to the Python FastAPI backend (/api/v1/*)
 * WebSocket streaming is handled separately by afyaSocket.js
 */

import afyaApi from "./afyaApi";
import afyaSocket, { MSG_OUT } from "./afyaSocket";
import { v4 as uuidv4 } from "uuid";

// ── Session management ────────────────────────────────────────────────────────

/**
 * Create or retrieve the current AFYA session ID.
 * Stored in sessionStorage so it resets on tab close.
 */
export function getOrCreateSessionId() {
  let id = sessionStorage.getItem("afya_session_id");
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem("afya_session_id", id);
  }
  return id;
}

/**
 * Start a full AFYA voice session (WebSocket + intro prompt).
 * @param {string} mode - "home" | "navigation" | "coach"
 */
export async function startAfyaSession(mode = "home") {
  const sessionId = getOrCreateSessionId();

  // Connect WebSocket
  afyaSocket.connect(sessionId, mode);

  // Wait for connection then send intro
  const unsubscribe = afyaSocket.on("connected", () => {
    unsubscribe();
    setTimeout(() => afyaSocket.startIntro(), 300);
  });

  return sessionId;
}

/**
 * End the current AFYA session.
 */
export function endAfyaSession() {
  afyaSocket.stopIntro();
  afyaSocket.disconnect();
  sessionStorage.removeItem("afya_session_id");
}

// ── Coaching session ──────────────────────────────────────────────────────────

export async function startCoachingSession(sessionId, sessionType = "interview") {
  try {
    const { data } = await afyaApi.post(`/api/v1/session/${sessionId}/start`, {
      session_type: sessionType,
    });
    return data;
  } catch (err) {
    console.error("[AIChat] startCoachingSession error:", err);
    throw err;
  }
}

export async function endCoachingSession(sessionId) {
  try {
    const { data } = await afyaApi.post(`/api/v1/session/${sessionId}/end`);
    return data;
  } catch (err) {
    console.error("[AIChat] endCoachingSession error:", err);
    throw err;
  }
}

export async function getCoachingSummary(sessionId) {
  try {
    const { data } = await afyaApi.get(`/api/v1/session/${sessionId}/summary`);
    return data;
  } catch (err) {
    console.error("[AIChat] getCoachingSummary error:", err);
    return null;
  }
}

// ── Emergency ─────────────────────────────────────────────────────────────────

export async function triggerSOS(sessionId, location, alertType = "manual") {
  try {
    // Also fire over WebSocket for lowest latency
    afyaSocket.triggerSOS(location, alertType);

    // Also POST to REST for persistence
    const { data } = await afyaApi.post("/api/v1/emergency/sos", {
      session_id: sessionId,
      location,
      alert_type: alertType,
      trigger_method: "button",
    });
    return data;
  } catch (err) {
    console.error("[AIChat] triggerSOS error:", err);
    throw err;
  }
}

export async function resolveEmergency(alertId, notes = "") {
  try {
    const { data } = await afyaApi.post(`/api/v1/emergency/${alertId}/resolve`, { notes });
    return data;
  } catch (err) {
    console.error("[AIChat] resolveEmergency error:", err);
    throw err;
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────

export async function getNearbyHealthFacilities(lat, lng, type = "hospital") {
  try {
    const { data } = await afyaApi.get("/api/v1/navigation/nearby", {
      params: { lat, lng, type, radius: 5000 },
    });
    return data;
  } catch (err) {
    console.error("[AIChat] getNearbyHealthFacilities error:", err);
    return [];
  }
}

// ── Health check ──────────────────────────────────────────────────────────────

export async function checkAfyaHealth() {
  try {
    const { data } = await afyaApi.get("/health");
    return data.status === "healthy";
  } catch {
    return false;
  }
}

export async function sendAfyaMessage({
  sessionId,
  message,
  mode = "home",
}) {
  try {
    const response = await afyaApi.post("/api/v1/chat", {
      session_id: sessionId,
      message,
      mode,
    });

    return response.data; // { response: "..." }
  } catch (error) {
    console.error("[AFYA CHAT ERROR]", error);
    throw error;
  }
}