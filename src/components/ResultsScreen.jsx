import React, { useState, useEffect } from "react";
import { Flame, Copy, RotateCcw, Trophy } from "lucide-react";
import { C, GANAS } from "../theme";
import { submitScore, fetchAllScores, dedupeLatestAttempts, scoresForWeek } from "../lib/scores";
import { loadPlayer, savePlayer } from "../lib/player";

function flameRating(score, total) {
  const pct = score / total;
  if (pct >= 0.95) return { flames: 5, label: "Guru dakshina level!" };
  if (pct >= 0.75) return { flames: 4, label: "Beautifully learnt." };
  if (pct >= 0.55) return { flames: 3, label: "Good progress." };
  if (pct >= 0.3) return { flames: 2, label: "Getting there." };
  return { flames: 1, label: "Practice this stanza once more this week." };
}

export default function ResultsScreen({ week, score, onReplay, onHome }) {
  const total = week.questions.length + week.matchPairs.length;
  const { flames, label } = flameRating(score, total);
  const [name, setName] = useState("");
  const [gana, setGana] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [board, setBoard] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = loadPlayer();
    setName(p.name || "");
    setGana(p.gana || "");
  }, [week.id]);

  const submit = async () => {
    if (!name.trim() || !gana || saving) return;
    setSaving(true);
    savePlayer(name.trim(), gana);
    await submitScore({ weekId: week.id, name: name.trim(), gana, score, total });
    const raw = await fetchAllScores();
    const deduped = dedupeLatestAttempts(raw);
    setBoard(scoresForWeek(deduped, week.id));
    setSaved(true);
    setSaving(false);
  };

  const shareText = `🔥 Sangha Prarthana Yatra — Week ${week.number}\n${name || "I"} scored ${score}/${total} on Stanza ${week.stanzaRange}!\nCan you beat that? 🙏`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <div className="spy-root" style={{ background: C.cream, minHeight: "100%", padding: "28px 20px 40px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Flame key={i} size={26} color={i < flames ? C.kumkum : C.creamDeep} fill={i < flames ? C.gold : "none"} />
          ))}
        </div>
        <h2 className="spy-display" style={{ fontSize: 28, color: C.indigo, margin: "4px 0" }}>
          {score} / {total}
        </h2>
        <p style={{ color: C.ash, opacity: 0.75, fontSize: 14, marginTop: 0 }}>{label}</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 18, marginTop: 22, border: `1px solid ${C.creamDeep}` }}>
        {!saved ? (
          <>
            <p style={{ fontSize: 14, color: C.ash, marginBottom: 10 }}>Add your name and gana to the leaderboard:</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${C.creamDeep}`,
                fontSize: 14,
                fontFamily: "'Mukta', sans-serif",
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {GANAS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGana(g)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `2px solid ${gana === g ? C.kumkum : C.creamDeep}`,
                    background: gana === g ? "#fbeae4" : "#fff",
                    color: gana === g ? C.kumkumDark : C.ash,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={!name.trim() || !gana || saving}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: !name.trim() || !gana || saving ? C.creamDeep : C.kumkum,
                color: !name.trim() || !gana || saving ? "#a89a76" : "#fff",
                fontWeight: 600,
                cursor: !name.trim() || !gana || saving ? "default" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save my score"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Trophy size={18} color={C.gold} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.indigo }}>Week {week.number} leaderboard</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {board.slice(0, 8).map((e, i) => (
                <div
                  key={e.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: e.name.toLowerCase() === name.trim().toLowerCase() ? "#fbeae4" : "transparent",
                  }}
                >
                  <span style={{ color: C.ash, fontWeight: e.name.toLowerCase() === name.trim().toLowerCase() ? 700 : 500 }}>
                    {i + 1}. {e.name} <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>· {e.gana}</span>
                  </span>
                  <span style={{ color: C.kumkum, fontWeight: 600 }}>
                    {e.score}/{e.total}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={copyShare}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "12px",
          borderRadius: 12,
          border: `1px solid ${C.creamDeep}`,
          background: "#fff",
          color: C.indigo,
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <Copy size={16} /> {copied ? "Copied — paste it in the group!" : "Copy score for WhatsApp"}
      </button>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          onClick={onReplay}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${C.creamDeep}`,
            background: "#fff",
            color: C.ash,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={15} /> Try again
        </button>
        <button
          onClick={onHome}
          style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: C.indigo, color: "#fff", fontWeight: 600, cursor: "pointer" }}
        >
          Back to Yatra
        </button>
      </div>
    </div>
  );
}
