const KEY = "spy-player";

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { name: "", gana: "" };
  } catch {
    return { name: "", gana: "" };
  }
}

export function savePlayer(name, gana) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ name, gana }));
  } catch {
    /* best effort */
  }
}
