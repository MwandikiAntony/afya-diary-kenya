import React, { useState } from "react";
import PatientLayout from "../PatientLayout";
import { FONTS, BASE_STYLES } from "../Shared/UI";

const C = {
  em700: "#047857", em600: "#059669", em500: "#10b981", em100: "#d1fae5", em50: "#ecfdf5",
  sky600: "#0284c7", sky100: "#e0f2fe",
  pur600: "#7c3aed", pur100: "#ede9fe",
  amb600: "#d97706", amb100: "#fef3c7",
  sl900: "#0f172a", sl700: "#334155", sl600: "#475569", sl500: "#64748b",
  sl200: "#e2e8f0", sl100: "#f1f5f9", sl50: "#f8fafc", white: "#ffffff",
};

const CATEGORIES = [
  { id: "all",       label: "All Tips" },
  { id: "stress",    label: "Stress" },
  { id: "sleep",     label: "Sleep" },
  { id: "nutrition", label: "Nutrition" },
  { id: "movement",  label: "Movement" },
  { id: "social",    label: "Relationships" },
];

const TIPS = [
  {
    category: "stress",
    title: "Box breathing for calm",
    body: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle four times. This activates your parasympathetic nervous system and lowers cortisol within minutes.",
    accent: C.sky600, bg: C.sky100,
  },
  {
    category: "stress",
    title: "Name what you are feeling",
    body: "Research shows that labelling emotions, whether frustration, worry, or sadness, reduces their intensity. Take a moment to write down exactly what you feel before reacting to a stressful situation.",
    accent: C.sky600, bg: C.sky100,
  },
  {
    category: "sleep",
    title: "Keep a consistent wake time",
    body: "Going to bed at the same time matters less than waking at the same time. A fixed wake time anchors your circadian rhythm and improves sleep quality within a week.",
    accent: C.pur600, bg: C.pur100,
  },
  {
    category: "sleep",
    title: "Avoid screens one hour before bed",
    body: "Blue light from phones and laptops suppresses melatonin production. Replace screen time before bed with reading, light stretching, or a warm shower to signal sleep readiness.",
    accent: C.pur600, bg: C.pur100,
  },
  {
    category: "sleep",
    title: "Keep your room cool",
    body: "The body needs to lower its core temperature to initiate sleep. A room temperature between 18 and 22 degrees Celsius supports faster sleep onset and better deep sleep cycles.",
    accent: C.pur600, bg: C.pur100,
  },
  {
    category: "nutrition",
    title: "Eat breakfast within two hours of waking",
    body: "Eating a protein-rich breakfast stabilises blood sugar, reduces afternoon cravings, and supports mental focus throughout the morning. Eggs, milk, beans, and groundnuts are affordable protein sources in Kenya.",
    accent: C.em600, bg: C.em50,
  },
  {
    category: "nutrition",
    title: "Stay hydrated throughout the day",
    body: "Mild dehydration of just 1 to 2 percent of body weight reduces concentration, worsens mood, and increases headaches. Aim for at least 8 glasses of water daily and more when working outdoors.",
    accent: C.em600, bg: C.em50,
  },
  {
    category: "nutrition",
    title: "Reduce ultra-processed foods",
    body: "Frequent consumption of packaged snacks and sugary drinks is linked to higher rates of depression and anxiety. Whole foods such as vegetables, fruits, whole grains, and lean proteins support brain health.",
    accent: C.em600, bg: C.em50,
  },
  {
    category: "movement",
    title: "Walk for 20 minutes daily",
    body: "A 20-minute daily walk reduces symptoms of depression and anxiety as effectively as some medications in mild to moderate cases. It also improves cardiovascular health, sleep quality, and energy levels.",
    accent: C.amb600, bg: C.amb100,
  },
  {
    category: "movement",
    title: "Stretch every hour at your desk",
    body: "Sitting for long periods tightens hip flexors and shoulders, contributing to low back pain and fatigue. Set a reminder to stand and do 5 minutes of gentle stretching every hour.",
    accent: C.amb600, bg: C.amb100,
  },
  {
    category: "social",
    title: "Invest in one quality conversation daily",
    body: "Loneliness is a significant risk factor for poor mental health. One meaningful conversation per day, whether in person, by phone, or by message, strengthens social bonds and boosts wellbeing.",
    accent: C.sky600, bg: C.sky100,
  },
  {
    category: "social",
    title: "Set boundaries without guilt",
    body: "Saying no to requests that drain you is not selfish. Healthy boundaries protect your energy and improve the quality of the relationships you do invest in. Practice a simple, clear refusal without over-explaining.",
    accent: C.sky600, bg: C.sky100,
  },
  {
    category: "stress",
    title: "Limit news consumption",
    body: "Constant exposure to negative news activates the stress response and increases anxiety. Limit news to one or two scheduled times per day and choose reliable sources over social media feeds.",
    accent: C.sky600, bg: C.sky100,
  },
  {
    category: "sleep",
    title: "Write tomorrow's list tonight",
    body: "Lying awake thinking about unfinished tasks is a common sleep disruptor. Spend five minutes before bed writing a short list of what you need to do tomorrow. This offloads the mental burden and promotes sleep.",
    accent: C.pur600, bg: C.pur100,
  },
];

export default function MentalHealthTips() {
  const [active, setActive] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = active === "all" ? TIPS : TIPS.filter(t => t.category === active);

  return (
    <PatientLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}{`
        .tip-card {
          background: #fff; border-radius: 13px; border: 1px solid #e2e8f0;
          box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden;
          transition: box-shadow .2s;
        }
        .tip-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,.08); }
        .tip-btn {
          width: 100%; background: none; border: none; padding: 0;
          cursor: pointer; text-align: left; font-family: 'DM Sans',system-ui,sans-serif;
        }
        .cat-btn {
          padding: 7px 14px; border-radius: 999px; border: 1.5px solid;
          font-family: 'DM Sans',system-ui,sans-serif; font-size: .78rem;
          font-weight: 500; cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        @media (max-width: 500px) { .tips-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: ".68rem", fontWeight: 700, color: C.em600, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
          Mental Wellness
        </div>
        <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.75rem)", fontWeight: 400, color: C.sl900, marginBottom: 6 }}>
          Health Tips
        </h1>
        <p style={{ fontSize: ".855rem", color: C.sl500, lineHeight: 1.65, maxWidth: 520 }}>
          Practical, evidence-based tips for mental and physical wellbeing. Curated for everyday Kenyan life.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map(({ id, label }) => (
          <button key={id} className="cat-btn"
            style={{
              borderColor: active === id ? C.em600 : C.sl200,
              background: active === id ? C.em50 : C.white,
              color: active === id ? C.em600 : C.sl500,
            }}
            onClick={() => { setActive(id); setExpanded(null); }}>
            {label}
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {filtered.map((tip, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} className="tip-card" style={{ borderLeft: `3px solid ${tip.accent}` }}>
              <button className="tip-btn" onClick={() => setExpanded(isOpen ? null : i)}>
                <div style={{ padding: "16px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{
                      display: "inline-block", fontSize: ".68rem", fontWeight: 700,
                      color: tip.accent, textTransform: "uppercase", letterSpacing: ".1em",
                      background: tip.bg, padding: "2px 9px", borderRadius: 999, marginBottom: 8,
                    }}>
                      {tip.category}
                    </div>
                    <div style={{ fontSize: ".9rem", fontWeight: 600, color: C.sl900, lineHeight: 1.4 }}>
                      {tip.title}
                    </div>
                  </div>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.sl400} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 4, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${C.sl100}`, paddingTop: 12 }}>
                  <p style={{ fontSize: ".855rem", color: C.sl600, lineHeight: 1.75, margin: 0 }}>{tip.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28, background: C.sl50, border: `1px solid ${C.sl200}`, borderRadius: 12, padding: "16px 20px", fontSize: ".82rem", color: C.sl600, lineHeight: 1.7 }}>
        These tips are for general wellness and do not replace advice from a qualified healthcare professional. If you are experiencing serious mental health concerns, please speak with a doctor or call 0800 723 253 (Kenya Red Cross).
      </div>
    </PatientLayout>
  );
}