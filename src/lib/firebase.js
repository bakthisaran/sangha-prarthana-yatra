import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This config is a public client identifier, not a secret — safe to commit.
const firebaseConfig = {
  apiKey: "AIzaSyCRjPihCfHWslazgqPJY_viDfD0l-rCzYU",
  authDomain: "sangha-prarthana-yatra.firebaseapp.com",
  projectId: "sangha-prarthana-yatra",
  storageBucket: "sangha-prarthana-yatra.firebasestorage.app",
  messagingSenderId: "957576859366",
  appId: "1:957576859366:web:5f5ce0de0a48cc9a88b527",
  measurementId: "G-7N3JMFGXCH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
