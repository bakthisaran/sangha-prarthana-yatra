import React from "react";
import { Flame, Lock, ChevronRight, Trophy } from "lucide-react";
import { C } from "../theme";
import { WEEKS } from "../data/weeks";

export default function HomeScreen({ onSelect, onOpenLeaderboard, playerName }) {
  return (
    <div className="spy-root" style={{ background: C.cream, minHeight: "100%", padding: "28px 20px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div className="spy-deva" style={{ fontSize: 15, color: C.kumkum, letterSpacing: 1 }}>
          ॥ संघ प्रार्थना ॥
        </div>
        <h1 className="spy-display" style={{ fontSize: 34, color: C.indigo, margin: "6px 0 2px" }}>
          HSS Sangha Prarthana Yatra
        </h1>
        <p style={{ color: C.ash, opacity: 0.75, fontSize: 14, margin: 0 }}>
          Two stanzas a week. Learn it, live it, quiz it.
        </p>
      </div>

      {playerName ? (
        <p style={{ textAlign: "center", fontSize: 13, color: C.ash, opacity: 0.6, margin: "10px 0 0" }}>
          Welcome back, {playerName} 🙏
        </p>
      ) : null}

      <button
        onClick={onOpenLeaderboard}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "14px 16px",
          borderRadius: 14,
          border: `2px solid ${C.gold}`,
          background: C.indigo,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Trophy size={18} color={C.gold} /> Gana leaderboard
      </button>

      <div style={{ position: "relative", marginTop: 34, paddingLeft: 6 }}>
        <div
          style={{
            position: "absolute",
            left: 27,
            top: 8,
            bottom: 8,
            width: 3,
            background: `linear-gradient(${C.gold}, ${C.creamDeep})`,
            borderRadius: 3,
          }}
        />
        {WEEKS.map((w) => (
          <div
            key={w.id}
            onClick={() => w.unlocked && onSelect(w.id)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 26,
              cursor: w.unlocked ? "pointer" : "default",
            }}
          >
            <div
              className={w.unlocked ? "spy-flame-anim" : ""}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: w.unlocked ? C.kumkum : "#fff",
                border: `3px solid ${w.unlocked ? C.gold : C.creamDeep}`,
                color: w.unlocked ? "#fff" : "#c9bfa0",
                boxShadow: w.unlocked ? "0 4px 14px rgba(193,68,14,0.35)" : "none",
                zIndex: 1,
              }}
            >
              {w.unlocked ? <Flame size={24} /> : <Lock size={18} />}
            </div>
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: 14,
                padding: "12px 16px",
                border: `1px solid ${C.creamDeep}`,
                opacity: w.unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: 12, color: C.kumkum, fontWeight: 600, letterSpacing: 0.5 }}>
                WEEK {w.number} · STANZA {w.stanzaRange}
              </div>
              <div style={{ fontSize: 16, color: C.indigo, fontWeight: 600, marginTop: 2 }}>{w.title}</div>
            </div>
            {w.unlocked && <ChevronRight size={20} color={C.ash} style={{ opacity: 0.4, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: C.ash, opacity: 0.5, marginTop: 8 }}>
        New beads light up on the mala as each week's quiz opens.
      </p>
    </div>
  );
}
