import React, { useState, useMemo, useEffect } from "react";
import { C } from "../../theme";
import { shuffled } from "../../lib/utils";

export default function OrderRound({ lines, onDone }) {
  const shuffledLines = useMemo(() => shuffled(lines, 29), [lines]);
  const [order, setOrder] = useState([]); // ids, in the order they were tapped
  const [revealed, setRevealed] = useState(false);

  const tapLine = (id) => {
    if (revealed || order.includes(id)) return;
    setOrder((o) => [...o, id]);
  };

  useEffect(() => {
    if (order.length === lines.length && !revealed) setRevealed(true);
  }, [order, lines.length, revealed]);

  const correctIds = lines.map((l) => l.id);
  const score = revealed ? order.reduce((acc, id, i) => acc + (id === correctIds[i] ? 1 : 0), 0) : 0;

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => onDone(score), 1100);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  return (
    <div className="spy-pop-in" style={{ background: "#fff", borderRadius: 18, padding: 22, marginTop: 14, border: `1px solid ${C.creamDeep}` }}>
      <p style={{ fontSize: 16, color: C.indigo, fontWeight: 600, marginBottom: 4 }}>Put the lines in the correct order</p>
      <p style={{ fontSize: 13, color: C.ash, opacity: 0.6, marginBottom: 16 }}>Tap them in sequence, starting with the first line.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shuffledLines.map((l) => {
          const posIndex = order.indexOf(l.id);
          const isPicked = posIndex !== -1;
          const isCorrectPos = revealed && isPicked && correctIds[posIndex] === l.id;
          let border = C.creamDeep,
            bg = "#fff",
            color = C.ash,
            badgeBg = C.creamDeep,
            badgeColor = C.ash;

          if (isPicked && !revealed) {
            border = C.kumkum;
            bg = "#fbeae4";
            color = C.kumkumDark;
            badgeBg = C.kumkum;
            badgeColor = "#fff";
          }
          if (revealed && isPicked) {
            border = isCorrectPos ? C.green : C.kumkum;
            bg = isCorrectPos ? "#eaf3ec" : "#fbeae4";
            color = isCorrectPos ? C.green : C.kumkumDark;
            badgeBg = isCorrectPos ? C.green : C.kumkum;
            badgeColor = "#fff";
          }

          return (
            <button
              key={l.id}
              onClick={() => tapLine(l.id)}
              disabled={isPicked || revealed}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                border: `2px solid ${border}`,
                background: bg,
                color,
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
                cursor: isPicked || revealed ? "default" : "pointer",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: badgeBg,
                  color: badgeColor,
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isPicked ? posIndex + 1 : ""}
              </span>
              <span>{l.text}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <p style={{ fontSize: 13, color: C.green, fontWeight: 600, marginTop: 14, textAlign: "center" }}>
          {score} of {lines.length} in the right place
        </p>
      )}
    </div>
  );
}
