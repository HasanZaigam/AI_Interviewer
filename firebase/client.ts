// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBqwG82VhfrsgULQJRTzA-vUdRTzDfKmao",
  authDomain: "ai-interviewer-f86b9.firebaseapp.com",
  databaseURL: "https://ai-interviewer-f86b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-interviewer-f86b9",
  storageBucket: "ai-interviewer-f86b9.firebasestorage.app",
  messagingSenderId: "637227218047",
  appId: "1:637227218047:web:d53359c4d375ff677a3b4a",
  measurementId: "G-ZLCV15VW7G"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Configure auth settings
auth.useDeviceLanguage();

export { auth, db };