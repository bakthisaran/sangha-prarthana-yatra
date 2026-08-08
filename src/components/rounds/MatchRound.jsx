import React, { useState, useMemo, useEffect } from "react";
import { Check } from "lucide-react";
import { C } from "../../theme";
import { shuffled } from "../../lib/utils";

export default function MatchRound({ pairs, onDone }) {
  const wordOrder = useMemo(() => shuffled(pairs, 17), [pairs]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [matched, setMatched] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState(null);

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

  const done = matched.length === pairs.length;
  useEffect(() => {
    if (done) {
      const score = Math.max(0, pairs.length - mistakes);
      const t = setTimeout(() => onDone(score), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="spy-pop-in" style={{ background: "#fff", borderRadius: 18, padding: 22, marginTop: 14, border: `1px solid ${C.creamDeep}` }}>
      <p style={{ fontSize: 16, color: C.indigo, fontWeight: 600, marginBottom: 4 }}>Match each symbol to its word</p>
      <p style={{ fontSize: 13, color: C.ash, opacity: 0.6, marginBottom: 16 }}>Tap a symbol, then tap the word it belongs to.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {pairs.map((p) => {
          const isDone = matched.includes(p.id);
          const active = selectedEmoji === p.id;
          return (
            <button
              key={p.id}
              onClick={() => tapEmoji(p.id)}
              disabled={isDone}
              style={{
                fontSize: 28,
                aspectRatio: "1",
                borderRadius: 14,
                border: `2px solid ${isDone ? C.green : active ? C.kumkum : C.creamDeep}`,
                background: isDone ? "#eaf3ec" : active ? "#fbeae4" : C.cream,
                opacity: isDone ? 0.55 : 1,
                cursor: isDone ? "default" : "pointer",
              }}
            >
              {p.emoji}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {wordOrder.map((p) => {
          const isDone = matched.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => tapWord(p.id)}
              disabled={isDone}
              className={shakeId === p.id ? "spy-shake" : ""}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: `2px solid ${isDone ? C.green : C.creamDeep}`,
                background: isDone ? "#eaf3ec" : "#fff",
                color: isDone ? C.green : C.ash,
                fontSize: 14,
                fontWeight: 600,
                textAlign: "left",
                cursor: isDone ? "default" : "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{p.word}</span>
              {isDone && <Check size={16} />}
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
