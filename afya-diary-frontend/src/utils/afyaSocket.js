/**
 * AFYA WebSocket Manager
 *
 * Connects to the Python FastAPI backend WebSocket endpoint:
 *   ws://localhost:8080/ws/{session_id}
 *
 * Handles:
 *  - Audio streaming to Gemini Live (PCM 16kHz mono)
 *  - Receiving AI audio chunks back (PCM → plays in browser)
 *  - Receiving coach_hint and coach_metrics messages
 *  - Receiving detection messages (obstacle/navigation)
 *  - GPS position updates
 *  - SOS trigger
 *  - Reconnection with exponential backoff
 */

const WS_BASE = process.env.REACT_APP_WS_URL || "ws://localhost:8080";

// Message types sent TO the server
export const MSG_OUT = {
  START_SESSION:    "start_session",
  AUDIO_CHUNK:      "audio_chunk",
  VIDEO_FRAME:      "video_frame",
  GPS_UPDATE:       "gps_update",
  BARGE_IN:         "barge_in",
  START_INTRO:      "start_intro",
  STOP_INTRO:       "stop_intro",
  MODE_CHANGE:      "mode_change",
  SOS_TRIGGER:      "sos_trigger",
  PING:             "ping",
};

// Message types received FROM the server
export const MSG_IN = {
  AUDIO_CHUNK:      "audio_chunk",
  TEXT:             "text",
  TRANSCRIPTION:    "transcription",
  INTERRUPTED:      "interrupted",
  COACH_HINT:       "coach_hint",
  COACH_METRICS:    "coach_metrics",
  DETECTION:        "detection",
  NAVIGATION:       "navigation",
  SESSION_STARTED:  "session_started",
  ERROR:            "error",
  PONG:             "pong",
};

class AfyaSocketManager {
  constructor() {
    this._ws            = null;
    this._sessionId     = null;
    this._listeners     = {};       // type → Set<fn>
    this._reconnectTimer = null;
    this._reconnectDelay = 1000;    // ms, doubles each attempt
    this._maxDelay       = 16000;
    this._intentionalClose = false;
    this._audioContext  = null;
    this._audioQueue    = [];
    this._isPlayingAudio = false;
    this._mediaRecorder = null;
    this._micStream     = null;
  }

  // ── Connection ────────────────────────────────────────────────────────────

  /**
   * Open WebSocket connection to the AFYA Python backend.
   * @param {string} sessionId  UUID for this session
   * @param {string} mode       "home" | "navigation" | "coach"
   */
  connect(sessionId, mode = "home") {
    this._sessionId = sessionId;
    this._intentionalClose = false;
    sessionStorage.setItem("afya_session_id", sessionId);

    const url = `${WS_BASE}/ws/${sessionId}`;
    console.log(`[AfyaSocket] Connecting to ${url} (mode=${mode})`);

    try {
      this._ws = new WebSocket(url);
      this._ws.binaryType = "arraybuffer";

      this._ws.onopen    = () => this._onOpen(mode);
      this._ws.onmessage = (e) => this._onMessage(e);
      this._ws.onerror   = (e) => this._onError(e);
      this._ws.onclose   = (e) => this._onClose(e);
    } catch (err) {
      console.error("[AfyaSocket] WebSocket creation failed:", err);
    }
  }

  disconnect() {
    this._intentionalClose = true;
    clearTimeout(this._reconnectTimer);
    this._stopMic();
    if (this._ws) {
      this._ws.close(1000, "User disconnected");
      this._ws = null;
    }
    sessionStorage.removeItem("afya_session_id");
  }

  get isConnected() {
    return this._ws?.readyState === WebSocket.OPEN;
  }

  // ── Send helpers ──────────────────────────────────────────────────────────

  sendJSON(type, payload = {}) {
    if (!this.isConnected) return;
    try {
      this._ws.send(JSON.stringify({ type, ...payload }));
    } catch (err) {
      console.error("[AfyaSocket] sendJSON failed:", err);
    }
  }

  sendBinary(buffer) {
    if (!this.isConnected) return;
    try {
      this._ws.send(buffer);
    } catch (err) {
      console.error("[AfyaSocket] sendBinary failed:", err);
    }
  }

  sendGPS(lat, lng, accuracy = 0) {
    this.sendJSON(MSG_OUT.GPS_UPDATE, {
      location: { lat, lng, accuracy },
      timestamp: Date.now() / 1000,
    });
  }

  sendBargeIn(text = "[INTERRUPTED]") {
    this.sendJSON(MSG_OUT.BARGE_IN, {
      interrupt_text: text,
      timestamp: Date.now() / 1000,
    });
  }

  triggerSOS(location, alertType = "manual") {
    this.sendJSON(MSG_OUT.SOS_TRIGGER, {
      location,
      alert_type: alertType,
      trigger_method: "button",
      timestamp: Date.now() / 1000,
    });
  }

  changeMode(mode) {
    this.sendJSON(MSG_OUT.MODE_CHANGE, { mode });
  }

  startIntro() {
    this.sendJSON(MSG_OUT.START_INTRO);
  }

  stopIntro() {
    this.sendJSON(MSG_OUT.STOP_INTRO);
  }

  // ── Microphone ────────────────────────────────────────────────────────────

  /**
   * Start capturing mic audio and stream it to the AFYA backend.
   * Audio is resampled to PCM 16kHz mono as required by Gemini Live.
   */
  async startMic() {
    try {
      this._micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (!this._audioContext) {
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      }

      const source   = this._audioContext.createMediaStreamSource(this._micStream);
      const processor = this._audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (!this.isConnected) return;
        const float32 = e.inputBuffer.getChannelData(0);
        const int16   = this._float32ToInt16(float32);
        this.sendBinary(int16.buffer);
      };

      source.connect(processor);
      processor.connect(this._audioContext.destination);
      this._processor = processor;
      this._source    = source;

      console.log("[AfyaSocket] Mic started");
    } catch (err) {
      console.error("[AfyaSocket] Mic access failed:", err);
      this._emit("error", { message: "Microphone access denied. Please allow microphone access." });
    }
  }

  _stopMic() {
    try {
      if (this._processor) { this._processor.disconnect(); this._processor = null; }
      if (this._source)    { this._source.disconnect();    this._source = null; }
      if (this._micStream) {
        this._micStream.getTracks().forEach(t => t.stop());
        this._micStream = null;
      }
    } catch (err) {
      console.error("[AfyaSocket] Mic stop error:", err);
    }
  }

  // ── Audio playback ────────────────────────────────────────────────────────

  /**
   * Play a raw PCM audio buffer received from Gemini via the server.
   * Expects ArrayBuffer of 16-bit PCM at 24kHz (Gemini output rate).
   */
  async _playAudioChunk(arrayBuffer) {
    try {
      if (!this._audioContext) {
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const int16     = new Int16Array(arrayBuffer);
      const float32   = this._int16ToFloat32(int16);
      const audioBuffer = this._audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this._audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this._audioContext.destination);
      source.start();
    } catch (err) {
      console.error("[AfyaSocket] Audio playback error:", err);
    }
  }

  // ── PCM conversion helpers ────────────────────────────────────────────────

  _float32ToInt16(float32) {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16;
  }

  _int16ToFloat32(int16) {
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
    }
    return float32;
  }

  // ── WebSocket event handlers ──────────────────────────────────────────────

  _onOpen(mode) {
    console.log("[AfyaSocket] Connected");
    this._reconnectDelay = 1000;

    // Tell the server what mode we are starting in
    this.sendJSON(MSG_OUT.START_SESSION, {
      session_id: this._sessionId,
      mode,
      timestamp: Date.now() / 1000,
    });

    this._emit("connected", { sessionId: this._sessionId });
  }

  _onMessage(event) {
    // Binary → AI audio chunk from Gemini
    if (event.data instanceof ArrayBuffer) {
      this._playAudioChunk(event.data);
      this._emit(MSG_IN.AUDIO_CHUNK, { buffer: event.data });
      return;
    }

    // JSON messages
    try {
      const msg = JSON.parse(event.data);
      const { type, ...payload } = msg;

      // Auto-play audio that comes as base64 inside JSON
      if (type === MSG_IN.AUDIO_CHUNK && payload.data) {
        const binary = atob(payload.data);
        const buffer = new ArrayBuffer(binary.length);
        const view   = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
        this._playAudioChunk(buffer);
      }

      this._emit(type, payload);
    } catch (err) {
      console.error("[AfyaSocket] Message parse error:", err, event.data);
    }
  }

  _onError(event) {
    console.error("[AfyaSocket] WebSocket error:", event);
    this._emit("error", { message: "Connection error with AFYA AI service." });
  }

  _onClose(event) {
    console.log(`[AfyaSocket] Disconnected (code=${event.code})`);
    this._emit("disconnected", { code: event.code });

    if (!this._intentionalClose && event.code !== 1000) {
      this._scheduleReconnect();
    }
  }

  _scheduleReconnect() {
    if (this._reconnectTimer) return;
    console.log(`[AfyaSocket] Reconnecting in ${this._reconnectDelay}ms...`);
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null;
      if (this._sessionId) {
        this.connect(this._sessionId);
      }
      this._reconnectDelay = Math.min(this._reconnectDelay * 2, this._maxDelay);
    }, this._reconnectDelay);
  }

  // ── Event emitter ─────────────────────────────────────────────────────────

  on(type, fn) {
    if (!this._listeners[type]) this._listeners[type] = new Set();
    this._listeners[type].add(fn);
    return () => this.off(type, fn);  // Returns cleanup fn
  }

  off(type, fn) {
    this._listeners[type]?.delete(fn);
  }

  _emit(type, payload) {
    this._listeners[type]?.forEach(fn => {
      try { fn(payload); } catch (err) { console.error("[AfyaSocket] Listener error:", err); }
    });
  }
}

// Singleton instance — one connection across the whole app
const afyaSocket = new AfyaSocketManager();
export default afyaSocket;