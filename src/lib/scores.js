import { db } from "./firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const COLLECTION = "sangha-prarthana-scores";

export async function submitScore({ weekId, name, gana, score, total }) {
  await addDoc(collection(db, COLLECTION), {
    weekId,
    name: name.trim(),
    gana,
    score,
    total,
    createdAt: serverTimestamp(),
  });
}

export async function fetchAllScores() {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => d.data());
  } catch (err) {
    console.error("Failed to load scores from Firestore", err);
    return [];
  }
}

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (ts.seconds) return ts.seconds * 1000;
  return 0;
}

// Writes are append-only (every submit creates a new doc), so before using
// the data anywhere we collapse it to one row per person per week — their
// most recent attempt only.
export function dedupeLatestAttempts(entries) {
  const byKey = new Map();
  entries.forEach((e) => {
    if (!e.name || !e.weekId) return;
    const key = `${e.weekId}::${e.name.toLowerCase()}`;
    const ts = toMillis(e.createdAt);
    const cur = byKey.get(key);
    if (!cur || ts > cur._ts) byKey.set(key, { ...e, _ts: ts });
  });
  return Array.from(byKey.values());
}

export function scoresForWeek(dedupedAll, weekId) {
  return dedupedAll
    .filter((e) => e.weekId === weekId)
    .sort((a, b) => b.score - a.score || a._ts - b._ts);
}

export function countUniquePlayers(dedupedAll) {
  const names = new Set(dedupedAll.map((e) => e.name.toLowerCase()));
  return names.size;
}

export function aggregateIndividual(dedupedAll) {
  const byName = new Map();
  dedupedAll.forEach((e) => {
    const key = e.name.toLowerCase();
    const cur = byName.get(key) || { name: e.name, gana: e.gana, score: 0, total: 0, ts: 0 };
    cur.score += e.score;
    cur.total += e.total;
    cur.gana = e.gana || cur.gana;
    cur.ts = Math.max(cur.ts, e._ts);
    byName.set(key, cur);
  });
  return Array.from(byName.values()).sort((a, b) => b.score - a.score || a.ts - b.ts);
}

export function computeTeamStats(dedupedAll, ganas) {
  const stats = new Map(ganas.map((g) => [g, { gana: g, score: 0, total: 0, members: new Set() }]));
  dedupedAll.forEach((e) => {
    if (!stats.has(e.gana)) return;
    const s = stats.get(e.gana);
    s.score += e.score;
    s.total += e.total;
    s.members.add(e.name.toLowerCase());
  });
  return Array.from(stats.values())
    .map((s) => ({
      gana: s.gana,
      score: s.score,
      total: s.total,
      members: s.members.size,
      pct: s.total > 0 ? (s.score / s.total) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);
}
