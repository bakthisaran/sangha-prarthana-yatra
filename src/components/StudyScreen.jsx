import React from "react";
import { Volume2 } from "lucide-react";
import { C } from "../theme";
import { STUDY } from "../data/study";

export default function StudyScreen({ week, onBack, onStartQuiz }) {
  const study = STUDY[week.id];

  return (
    <div className="spy-root" style={{ background: C.cream, minHeight: "100%", padding: "20px 18px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.ash, opacity: 0.5, fontSize: 13, cursor: "pointer" }}>
          ← Back
        </button>
        <span style={{ fontSize: 12, color: C.kumkum, fontWeight: 600 }}>
          WEEK {week.number} · STANZA {week.stanzaRange}
        </span>
      </div>

      <h2 className="spy-display" style={{ fontSize: 24, color: C.indigo, textAlign: "center", margin: "4px 0 18px" }}>
        Study material
      </h2>

      {!study && (
        <p style={{ textAlign: "center", color: C.ash, opacity: 0.6, fontSize: 14, marginTop: 30 }}>
          Study material for this week is coming soon.
        </p>
      )}

      {study && (
        <>
          {study.audioSrc ? (
            <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: `1px solid ${C.creamDeep}`, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: C.indigo, fontWeight: 600, fontSize: 14 }}>
                <Volume2 size={16} /> Listen to the pronunciation
              </div>
              <audio controls src={study.audioSrc} style={{ width: "100%" }} />
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 16,
                border: `1px dashed ${C.creamDeep}`,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: C.ash,
                opacity: 0.5,
                fontSize: 13,
              }}
            >
              <Volume2 size={16} /> Audio coming soon
            </div>
          )}

          {study.lines.map((line) => (
            <div key={line.number} className="spy-pop-in" style={{ background: "#fff", borderRadius: 14, padding: 18, border: `1px solid ${C.creamDeep}`, marginBottom: 14 }}>
              <div className="spy-deva" style={{ fontSize: 18, color: C.indigo, lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 10 }}>
                {line.devanagari}
              </div>
              <div style={{ fontSize: 13, color: C.kumkumDark, fontStyle: "italic", whiteSpace: "pre-line", lineHeight: 1.5, marginBottom: 10 }}>
                {line.transliteration}
              </div>
              <div style={{ fontSize: 13, color: C.ash, opacity: 0.8, lineHeight: 1.5, borderTop: `1px solid ${C.creamDeep}`, paddingTop: 10 }}>
                {line.meaning}
              </div>
            </div>
          ))}

          {study.closing && (
            <div
              className="spy-pop-in"
              style={{
                textAlign: "center",
                background: C.indigo,
                borderRadius: 14,
                padding: "18px 16px",
                marginBottom: 14,
                border: `2px solid ${C.gold}`,
              }}
            >
              <div className="spy-deva" style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>
                {study.closing.devanagari}
              </div>
              <div style={{ fontSize: 13, color: C.gold, fontStyle: "italic", marginBottom: 6 }}>
                {study.closing.transliteration}
              </div>
              <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, letterSpacing: 0.5 }}>
                {study.closing.meaning}
              </div>
            </div>
          )}

          {study.images && study.images.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 6 }}>
              {study.images.map((img, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.creamDeep}` }}>
                  <img src={img.src} alt={img.caption || ""} style={{ width: "100%", display: "block" }} />
                  {img.caption && (
                    <div style={{ padding: "6px 8px", fontSize: 11, color: C.ash, opacity: 0.7, background: "#fff" }}>{img.caption}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}

      {week.unlocked ? (
        <button
          onClick={onStartQuiz}
          style={{
            width: "100%",
            marginTop: 22,
            padding: "13px",
            borderRadius: 12,
            border: "none",
            background: C.kumkum,
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Take the quiz →
        </button>
      ) : (
        <p style={{ textAlign: "center", fontSize: 12, color: C.ash, opacity: 0.5, marginTop: 22 }}>
          The quiz for this week opens on Friday 🔒
        </p>
      )}
    </div>
  );
}
