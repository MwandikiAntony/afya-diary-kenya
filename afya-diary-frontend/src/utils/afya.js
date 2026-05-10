/**
 * AfyaChat — core connection class for the AFYA Diary AI backend
 *
 * Based on the official AFYA Diary Frontend Connection Guide.
 * Connects directly to the Python FastAPI Cloud Run backend via:
 *   REST  → https://afya-backend-*.run.app/api/v1/...
 *   WS    → wss://afya-backend-*.run.app/ws/{session_id}
 *
 * The Node.js backend (port 5000) handles auth, patients, records.
 * This class ONLY talks to the Python AI backend (port 8080 / Cloud Run).
 */

const BACKEND_URL =
  process.env.REACT_APP_AFYA_BACKEND_URL || "http://localhost:8080";

export class AfyaChat {
  constructor(callbacks = {}) {
    /**
     * callbacks:
     *   onConnected()          — WebSocket open, greeting triggered
     *   onGreeting()           — Intro started on server
     *   onText(text)           — Transcription or text from Gemini
     *   onAudio(ArrayBuffer)   — Raw PCM audio chunk to play
     *   onCoachHint(hint)      — { hint, hint_type, category, urgency }
     *   onCoachMetrics(metrics)— { speakingRate, eyeContactScore, ... }
     *   onDetection(data)      — Obstacle / nav detection result
     *   onError(message)       — Error string
     *   onClose()              — WebSocket closed
     */
    this.callbacks   = callbacks;
    this.ws          = null;
    this.sessionId   = null;
    this._audioCtx   = null;
    this._micStream  = null;
    this._processor  = null;
    this._sourceNode = null;
    this._mediaRecorder = null;
  }

  // ── REST: create session then open WebSocket ───────────────────────────────

  async connect() {
    try {
      // 1. Create session on the AFYA Python backend
      const res = await fetch(`${BACKEND_URL}/api/v1/sessions/start`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_type: "dashboard" }),
      });

      if (!res.ok) {
        throw new Error(`Session creation failed: ${res.status}`);
      }

      const { session_id } = await res.json();
      this.sessionId = session_id;

      // Persist session ID so other utilities can reference it
      sessionStorage.setItem("afya_session_id", session_id);

      // 2. Open WebSocket — derive wss:// from the base URL
      const wsBase = BACKEND_URL
        .replace("https://", "wss://")
        .replace("http://",  "ws://");

      this.ws = new WebSocket(`${wsBase}/ws/${session_id}`);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen    = () => this._onOpen();
      this.ws.onmessage = (e) => this._onMessage(e);
      this.ws.onerror   = (e) => this._onError(e);
      this.ws.onclose   = ()  => this.callbacks.onClose?.();

    } catch (err) {
      console.error("[AfyaChat] connect() failed:", err);
      this.callbacks.onError?.(err.message || "Failed to connect to AFYA backend");
    }
  }

  // ── WebSocket send helpers ─────────────────────────────────────────────────

  send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  sendAudio(audioBlob) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    audioBlob.arrayBuffer().then(buf => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(buf);
      }
    }).catch(err => console.error("[AfyaChat] sendAudio error:", err));
  }

  sendRawPCM(int16Buffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(int16Buffer);
    }
  }

  startIntro()  { this.send({ type: "control", action: "start_intro" }); }
  stopIntro()   { this.send({ type: "control", action: "stop_intro"  }); }
  changeMode(m) { this.send({ type: "mode_change", mode: m });           }

  sendGPS(lat, lng, accuracy = 0) {
    this.send({
      type: "gps_update",
      location: { lat, lng, accuracy },
      timestamp: Date.now() / 1000,
    });
  }

  triggerSOS(location, alertType = "manual") {
    this.send({
      type: "sos_trigger",
      location,
      alert_type: alertType,
      trigger_method: "button",
      timestamp: Date.now() / 1000,
    });
  }

  sendBargeIn(text = "[INTERRUPTED]") {
    this.send({
      type: "barge_in",
      interrupt_text: text,
      timestamp: Date.now() / 1000,
    });
  }

  // ── Microphone (ScriptProcessor for PCM → Gemini) ─────────────────────────

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

      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000,
        });
      }

      this._sourceNode = this._audioCtx.createMediaStreamSource(this._micStream);
      this._processor  = this._audioCtx.createScriptProcessor(4096, 1, 1);

      this._processor.onaudioprocess = (e) => {
        if (this.ws?.readyState !== WebSocket.OPEN) return;
        const float32 = e.inputBuffer.getChannelData(0);
        const int16   = _float32ToInt16(float32);
        this.sendRawPCM(int16.buffer);
      };

      this._sourceNode.connect(this._processor);
      this._processor.connect(this._audioCtx.destination);

    } catch (err) {
      console.error("[AfyaChat] Mic error:", err);
      this.callbacks.onError?.("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  stopMic() {
    try {
      this._processor?.disconnect();
      this._sourceNode?.disconnect();
      this._micStream?.getTracks().forEach(t => t.stop());
    } catch (err) {
      console.error("[AfyaChat] stopMic error:", err);
    } finally {
      this._processor  = null;
      this._sourceNode = null;
      this._micStream  = null;
    }
  }

  // ── MediaRecorder (webm chunks — simpler, for basic voice) ───────────────

  async startMediaRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.sendAudio(event.data);
        }
      };

      recorder.start(250); // 250ms chunks — near real-time per PDF spec
      this._mediaRecorder = recorder;
      return recorder;
    } catch (err) {
      console.error("[AfyaChat] MediaRecorder error:", err);
      this.callbacks.onError?.("Microphone access denied.");
      return null;
    }
  }

  stopMediaRecorder() {
    if (this._mediaRecorder) {
      this._mediaRecorder.stop();
      this._mediaRecorder.stream.getTracks().forEach(t => t.stop());
      this._mediaRecorder = null;
    }
  }

  // ── Audio playback (PCM from Gemini → speakers) ───────────────────────────

  async playAudio(arrayBuffer) {
    try {
      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      // Resume if suspended (browser autoplay policy)
      if (this._audioCtx.state === "suspended") {
        await this._audioCtx.resume();
      }

      const int16   = new Int16Array(arrayBuffer);
      const float32 = _int16ToFloat32(int16);
      const buf     = this._audioCtx.createBuffer(1, float32.length, 24000);
      buf.getChannelData(0).set(float32);

      const src = this._audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(this._audioCtx.destination);
      src.start();
    } catch (err) {
      console.error("[AfyaChat] Audio playback error:", err);
    }
  }

  // ── REST endpoints ────────────────────────────────────────────────────────

  async findServices(lat, lng, type = "hospital") {
    try {
      const res = await fetch(
        `${BACKEND_URL}/health/nearbyservices?lat=${lat}&lng=${lng}&service_type=${type}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      console.error("[AfyaChat] findServices error:", err);
      return { facilities: [] };
    }
  }

  async getPatientSummary(patientId, fhirUrl = "http://hapi.fhir.org/baseR4") {
    try {
      const res = await fetch(`${BACKEND_URL}/health/patient/summary`, {
        headers: {
          "X-Patient-ID":       patientId,
          "X-FHIR-Server-URL":  fhirUrl,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      console.error("[AfyaChat] getPatientSummary error:", err);
      return null;
    }
  }

  async getHealthAssessment(patientId, fhirUrl = "http://hapi.fhir.org/baseR4") {
    try {
      const res = await fetch(`${BACKEND_URL}/health/assessment`, {
        headers: {
          "X-Patient-ID":       patientId,
          "X-FHIR-Server-URL":  fhirUrl,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      console.error("[AfyaChat] getHealthAssessment error:", err);
      return null;
    }
  }

  async triggerSOSRest(location, alertType = "manual") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/emergency/sos`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id:     this.sessionId,
          location,
          alert_type:     alertType,
          trigger_method: "button",
        }),
      });
      return res.json();
    } catch (err) {
      console.error("[AfyaChat] triggerSOSRest error:", err);
      return null;
    }
  }

  // ── WebSocket internal handlers ───────────────────────────────────────────

  _onOpen() {
    this.callbacks.onConnected?.();
    // Trigger AFYA greeting per PDF spec
    this.send({ type: "control", action: "start_intro" });
  }

  _onMessage(event) {
    // Binary ArrayBuffer → audio from Gemini
    if (event.data instanceof ArrayBuffer) {
      this.playAudio(event.data);
      this.callbacks.onAudio?.(event.data);
      return;
    }

    // Text JSON message
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "intro_started":
          this.callbacks.onGreeting?.();
          break;

        case "gemini_text":
        case "transcription":
          if (msg.text) this.callbacks.onText?.(msg.text, msg.role);
          break;

        case "audio_chunk":
          // Some backends encode audio as base64 in JSON
          if (msg.data) {
            const binary = atob(msg.data);
            const buf    = new ArrayBuffer(binary.length);
            const view   = new Uint8Array(buf);
            for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
            this.playAudio(buf);
            this.callbacks.onAudio?.(buf);
          }
          break;

        case "coach_hint":
          this.callbacks.onCoachHint?.({
            hint:      msg.hint,
            hint_type: msg.hint_type,
            category:  msg.category,
            urgency:   msg.urgency,
          });
          break;

        case "coach_metrics":
          this.callbacks.onCoachMetrics?.(msg.metrics);
          break;

        case "detection":
          this.callbacks.onDetection?.(msg);
          break;

        case "interrupted":
          // AI was interrupted — no action needed on frontend
          break;

        case "error":
          this.callbacks.onError?.(msg.error || "Unknown error from AFYA backend");
          break;

        case "pong":
          break;

        default:
          // Unknown message type — pass through in case caller needs it
          this.callbacks.onMessage?.(msg);
          break;
      }
    } catch (err) {
      console.error("[AfyaChat] Message parse error:", err, event.data?.slice?.(0, 100));
    }
  }

  _onError(event) {
    console.error("[AfyaChat] WebSocket error:", event);
    this.callbacks.onError?.("Connection error with AFYA AI service.");
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  disconnect() {
    this.stopMic();
    this.stopMediaRecorder();
    this.ws?.close(1000, "User disconnected");
    this.ws = null;
    sessionStorage.removeItem("afya_session_id");
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// ── PCM conversion helpers ────────────────────────────────────────────────────

function _float32ToInt16(float32) {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

function _int16ToFloat32(int16) {
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
  }
  return float32;
}

export default AfyaChat;