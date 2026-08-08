const KEY = "spy-attempts";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* best effort */
  }
}

// Call once when a quiz attempt is completed (i.e. results are shown).
export function recordAttempt(weekId) {
  if (!weekId) return;
  const data = loadAll();
  const today = todayStr();
  const entry = data[weekId];
  if (entry && entry.date === today) {
    entry.count += 1;
  } else {
    data[weekId] = { date: today, count: 1 };
  }
  saveAll(data);
}

export function getAttemptsToday(weekId) {
  const data = loadAll();
  const entry = data[weekId];
  if (!entry || entry.date !== todayStr()) return 0;
  return entry.count;
}
