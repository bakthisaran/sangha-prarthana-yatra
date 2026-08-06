import React, { useState, useMemo, useEffect } from "react";
import { Check, X } from "lucide-react";
import { C } from "../theme";
import { shuffled } from "../lib/utils";

export default function QuizScreen({ week, onFinish, onExit }) {
  const totalSteps = week.questions.length + 1; // + match round
  const [step, setStep] = useState(0);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const wordOrder = useMemo(() => shuffled(week.matchPairs, 17), [week.matchPairs]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [matched, setMatched] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState(null);

  const isMatchStep = step === week.questions.length;
  const q = !isMatchStep ? week.questions[step] : null;

  const chooseOption = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === q.correct) setMcqCorrect((c) => c + 1);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setStep((s) => s + 1);
  };

  const tapEmoji = (id) => {
    if (matched.includes(id)) return;
    setSelectedEmoji(id);
  };
  const tapWord = (id) => {
    if (matched.includes(id) || !selectedEmoji) return;
    if (selectedEmoji === id) {
      setMatched((m) => [...m, id]);
      setSelectedEmoji(null);
    } else {
      setMistakes((m) => m + 1);
      setShakeId(id);
      setTimeout(() => setShakeId(null), 300);
      setSelectedEmoji(null);
    }
  };

  const matchDone = matched.length === week.matchPairs.length;
  const matchScore = matchDone ? Math.max(0, week.matchPairs.length - mistakes) : 0;

  useEffect(() => {
    if (isMatchStep && matchDone) {
      const t = setTimeout(() => onFinish(mcqCorrect + matchScore), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDone, isMatchStep]);

  return (
    <div className="spy-root" style={{ background: C.cream, minHeight: "100%", padding: "20px 18px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: C.ash, opacity: 0.5, fontSize: 13, cursor: "pointer" }}>
          ← Back
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i < step ? C.green : i === step ? C.kumkum : C.creamDeep,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 12, color: C.kumkum, fontWeight: 600, textAlign: "center", marginBottom: 4 }}>
        WEEK {week.number} · STANZA {week.stanzaRange}
      </div>

      {!isMatchStep ? (
        <div key={step} className="spy-pop-in" style={{ background: "#fff", borderRadius: 18, padding: 22, marginTop: 14, border: `1px solid ${C.creamDeep}` }}>
          <p style={{ fontSize: 17, color: C.indigo, fontWeight: 600, lineHeight: 1.4, marginBottom: 18 }}>{q.prompt}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, idx) => {
              let bg = "#fff",
                border = C.creamDeep,
                color = C.ash;
              if (revealed) {
                if (idx === q.correct) {
                  bg = "#eaf3ec";
                  border = C.green;
                  color = C.green;
                } else if (idx === selected) {
                  bg = "#fbeae4";
                  border = C.kumkum;
                  color = C.kumkumDark;
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => chooseOption(idx)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `2px solid ${border}`,
                    background: bg,
                    color,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: revealed ? "default" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {opt}
                  {revealed && idx === q.correct && <Check size={18} />}
                  {revealed && idx === selected && idx !== q.correct && <X size={18} />}
                </button>
              );
            })}
          </div>
          {revealed && (
            <button
              onClick={next}
              style={{
                marginTop: 18,
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: C.kumkum,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {step === week.questions.length - 1 ? "Continue to matching round" : "Next question"}
            </button>
          )}
        </div>
      ) : (
        <div className="spy-pop-in" style={{ background: "#fff", borderRadius: 18, padding: 22, marginTop: 14, border: `1px solid ${C.creamDeep}` }}>
          <p style={{ fontSize: 16, color: C.indigo, fontWeight: 600, marginBottom: 4 }}>Match each symbol to its word</p>
          <p style={{ fontSize: 13, color: C.ash, opacity: 0.6, marginBottom: 16 }}>Tap a symbol, then tap the word it belongs to.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {week.matchPairs.map((p) => {
              const done = matched.includes(p.id);
              const active = selectedEmoji === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => tapEmoji(p.id)}
                  disabled={done}
                  style={{
                    fontSize: 28,
                    aspectRatio: "1",
                    borderRadius: 14,
                    border: `2px solid ${done ? C.green : active ? C.kumkum : C.creamDeep}`,
                    background: done ? "#eaf3ec" : active ? "#fbeae4" : C.cream,
                    opacity: done ? 0.55 : 1,
                    cursor: done ? "default" : "pointer",
                  }}
                >
                  {p.emoji}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {wordOrder.map((p) => {
              const done = matched.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => tapWord(p.id)}
                  disabled={done}
                  className={shakeId === p.id ? "spy-shake" : ""}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `2px solid ${done ? C.green : C.creamDeep}`,
                    background: done ? "#eaf3ec" : "#fff",
                    color: done ? C.green : C.ash,
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "left",
                    cursor: done ? "default" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{p.word}</span>
                  {done && <Check size={16} />}
                </button>
              );
            })}
          </div>

          {mistakes > 0 && !matchDone && (
            <p style={{ fontSize: 12, color: C.kumkum, opacity: 0.7, marginTop: 12 }}>
              {mistakes} mismatch{mistakes > 1 ? "es" : ""} so far — keep going!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
