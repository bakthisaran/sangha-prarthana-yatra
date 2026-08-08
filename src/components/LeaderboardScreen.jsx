import React, { useState, useEffect, useMemo } from "react";
import { Trophy } from "lucide-react";
import { C, GANAS, GANA_COLORS, memberLabel } from "../theme";
import { fetchAllScores, dedupeBestAttempts, aggregateIndividual, computeTeamStats } from "../lib/scores";

export default function LeaderboardScreen({ onBack }) {
  const [mode, setMode] = useState("team"); // 'team' | 'individual'
  const [ganaFilter, setGanaFilter] = useState("All");
  const [dedupedAll, setDedupedAll] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllScores().then((raw) => {
      if (!cancelled) setDedupedAll(dedupeBestAttempts(raw));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const teamStats = useMemo(() => (dedupedAll ? computeTeamStats(dedupedAll, GANAS) : []), [dedupedAll]);
  const individualStats = useMemo(() => (dedupedAll ? aggregateIndividual(dedupedAll) : []), [dedupedAll]);
  const filteredIndividual =
    ganaFilter === "All" ? individualStats : individualStats.filter((e) => e.gana === ganaFilter);

  const totalMembers = teamStats.reduce((sum, t) => sum + t.members, 0);

  return (
    <div className="spy-root" style={{ background: C.cream, minHeight: "100%", padding: "20px 18px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.ash, opacity: 0.5, fontSize: 13, cursor: "pointer" }}>
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Trophy size={16} color={C.gold} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.indigo }}>Gana Leaderboard</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, background: "#fff", padding: 4, borderRadius: 12, border: `1px solid ${C.creamDeep}` }}>
        {[
          { id: "team", label: "Team (by gana)" },
          { id: "individual", label: "Individual" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              border: "none",
              background: mode === t.id ? C.indigo : "transparent",
              color: mode === t.id ? "#fff" : C.ash,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {dedupedAll === null && <p style={{ textAlign: "center", color: C.ash, opacity: 0.6, fontSize: 13 }}>Loading scores…</p>}

      {dedupedAll !== null && totalMembers === 0 && (
        <p style={{ textAlign: "center", color: C.ash, opacity: 0.6, fontSize: 13, marginTop: 30 }}>
          No scores saved yet — be the first to finish a quiz and save your name!
        </p>
      )}

      {dedupedAll !== null && totalMembers > 0 && mode === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {teamStats.map((t, i) => (
            <div
              key={t.gana}
              className="spy-pop-in"
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "14px 16px",
                border: `1px solid ${C.creamDeep}`,
                borderLeft: `6px solid ${GANA_COLORS[t.gana]}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: C.gold,
                      color: C.indigo,
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.indigo }}>{t.gana}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: GANA_COLORS[t.gana] }}>
                  {t.total > 0 ? `${t.pct.toFixed(0)}%` : "—"}
                </span>
              </div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 6, background: C.creamDeep, overflow: "hidden" }}>
                <div style={{ width: `${t.pct}%`, height: "100%", background: GANA_COLORS[t.gana], borderRadius: 6 }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: C.ash, opacity: 0.65 }}>
                {t.members} {memberLabel(t.gana, t.members)} · {t.score}/{t.total} points combined
              </div>
            </div>
          ))}
        </div>
      )}

      {dedupedAll !== null && totalMembers > 0 && mode === "individual" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {["All", ...GANAS].map((g) => (
              <button
                key={g}
                onClick={() => setGanaFilter(g)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `2px solid ${ganaFilter === g ? C.kumkum : C.creamDeep}`,
                  background: ganaFilter === g ? "#fbeae4" : "#fff",
                  color: ganaFilter === g ? C.kumkumDark : C.ash,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {g}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredIndividual.length === 0 && (
              <p style={{ textAlign: "center", color: C.ash, opacity: 0.6, fontSize: 13, marginTop: 20 }}>
                No scores yet for {ganaFilter}.
              </p>
            )}
            {filteredIndividual.map((e, i) => (
              <div
                key={e.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#fff",
                  border: `1px solid ${C.creamDeep}`,
                }}
              >
                <span style={{ color: C.ash, fontWeight: 600 }}>
                  {i + 1}. {e.name}{" "}
                  <span style={{ fontSize: 11, fontWeight: 700, color: GANA_COLORS[e.gana] || C.green }}>
                    · {e.gana}
                  </span>
                </span>
                <span style={{ color: C.kumkum, fontWeight: 700 }}>
                  {e.score}/{e.total}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
