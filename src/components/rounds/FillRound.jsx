import React, { useState, useMemo, useEffect } from "react";
import { C } from "../../theme";
import { shuffled } from "../../lib/utils";

export default function FillRound({ blanks, onDone }) {
  const wordBank = useMemo(() => shuffled(blanks, 41), [blanks]);
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [filled, setFilled] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState(null);

  const tapBlank = (id) => {
    if (filled.includes(id)) return;
    setSelectedBlank(id);
  };
  const tapWord = (b) => {
    if (filled.includes(b.id) || !selectedBlank) return;
    if (selectedBlank === b.id) {
      setFilled((f) => [...f, b.id]);
      setSelectedBlank(null);
    } else {
      setMistakes((m) => m + 1);
      setShakeId(b.id);
      setTimeout(() => setShakeId(null), 300);
      setSelectedBlank(null);
    }
  };

  const done = filled.length === blanks.length;
  useEffect(() => {
    if (done) {
      const score = Math.max(0, blanks.length - mistakes);
      const t = setTimeout(() => onDone(score), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="spy-pop-in" style={{ background: "#fff", borderRadius: 18, padding: 22, marginTop: 14, border: `1px solid ${C.creamDeep}` }}>
      <p style={{ fontSize: 16, color: C.indigo, fontWeight: 600, marginBottom: 4 }}>Fill in the missing words</p>
      <p style={{ fontSize: 13, color: C.ash, opacity: 0.6, marginBottom: 16 }}>Tap a blank, then tap the word that fills it.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {blanks.map((b) => {
          const isFilled = filled.includes(b.id);
          const isSelected = selectedBlank === b.id;
          return (
            <div key={b.id} style={{ fontSize: 14, color: C.indigo, lineHeight: 1.7 }}>
              {b.before}
              <button
                onClick={() => tapBlank(b.id)}
                disabled={isFilled}
                className={shakeId === b.id ? "spy-shake" : ""}
                style={{
                  display: "inline-block",
                  minWidth: 84,
                  padding: "3px 10px",
                  margin: "0 2px",
                  borderRadius: 8,
                  border: `2px solid ${isFilled ? C.green : isSelected ? C.kumkum : C.creamDeep}`,
                  background: isFilled ? "#eaf3ec" : isSelected ? "#fbeae4" : C.cream,
                  color: isFilled ? C.green : C.kumkumDark,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: isFilled ? "default" : "pointer",
                }}
              >
                {isFilled ? b.word : "____"}
              </button>
              {b.after}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {wordBank.map((b) => {
          const isFilled = filled.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => tapWord(b)}
              disabled={isFilled}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: `2px solid ${C.creamDeep}`,
                background: isFilled ? C.creamDeep : "#fff",
                opacity: isFilled ? 0.4 : 1,
                color: C.ash,
                fontSize: 13,
                fontWeight: 600,
                cursor: isFilled ? "default" : "pointer",
              }}
            >
              {b.word}
            </button>
          );
        })}
      </div>

      {mistakes > 0 && !done && (
        <p style={{ fontSize: 12, color: C.kumkum, opacity: 0.7, marginTop: 12 }}>
          {mistakes} mismatch{mistakes > 1 ? "es" : ""} so far — keep going!
        </p>
      )}
    </div>
  );
}
