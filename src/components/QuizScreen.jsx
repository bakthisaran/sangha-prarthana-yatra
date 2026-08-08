import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { C } from "../theme";
import MatchRound from "./rounds/MatchRound";
import OrderRound from "./rounds/OrderRound";
import FillRound from "./rounds/FillRound";

const ROUND_LABELS = {
  match: "matching round",
  order: "line-ordering round",
  fill: "missing-word round",
};

export default function QuizScreen({ week, onFinish, onExit }) {
  const totalSteps = week.questions.length + 1; // + second round
  const [step, setStep] = useState(0);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isSecondRound = step === week.questions.length;
  const q = !isSecondRound ? week.questions[step] : null;
  const roundType = week.roundType || "match";

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

  const handleSecondRoundDone = (score) => {
    onFinish(mcqCorrect + score);
  };

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

      {!isSecondRound ? (
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
              {step === week.questions.length - 1 ? `Continue to ${ROUND_LABELS[roundType]}` : "Next question"}
            </button>
          )}
        </div>
      ) : (
        <>
          {roundType === "match" && <MatchRound pairs={week.matchPairs} onDone={handleSecondRoundDone} />}
          {roundType === "order" && <OrderRound lines={week.orderLines} onDone={handleSecondRoundDone} />}
          {roundType === "fill" && <FillRound blanks={week.fillBlanks} onDone={handleSecondRoundDone} />}
        </>
      )}
    </div>
  );
}
