import { db } from "./firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

export async function recordVisit() {
  try {
    const ref = doc(db, "meta", "stats");
    await setDoc(ref, { visits: increment(1) }, { merge: true });
  } catch (err) {
    console.error("Failed to record visit", err);
  }
}

export async function fetchVisitCount() {
  try {
    const ref = doc(db, "meta", "stats");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().visits || 0 : 0;
  } catch (err) {
    console.error("Failed to load visit count", err);
    return 0;
  }
}
