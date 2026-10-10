// src/firebase.js
// ─────────────────────────────────────────────────────────────
//  Replace all "YOUR_*" values with your actual Firebase config.
//  Find these in: Firebase Console → Project Settings → Your Apps
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCahUR4wRxbBy0rtTSX0Jr97g9HEhsllFM",
  authDomain: "authtest-5083c.firebaseapp.com",
  projectId: "authtest-5083c",
  storageBucket: "authtest-5083c.firebasestorage.app",
  messagingSenderId: "1027598109984",
  appId: "1:1027598109984:web:0e56b99a1c1a14aa32db45",
  measurementId: "G-049CHE0S1R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
