import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This config is a public client identifier, not a secret — safe to commit.
const firebaseConfig = {
  apiKey: "AIzaSyDb4NpYEwtcoY8SgmIHRqAok9qKJF4Ej4k",
  authDomain: "shakha-feedback.firebaseapp.com",
  projectId: "shakha-feedback",
  storageBucket: "shakha-feedback.firebasestorage.app",
  messagingSenderId: "1046199610177",
  appId: "1:1046199610177:web:06d691bddaebf974d44fc0",
  measurementId: "G-64QDQ4WGEV",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
