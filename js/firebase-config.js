// firebase-config.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqT_TzmeUHWsH_WAyKz5b94BoSI5hI63g",
  authDomain: "urbanthreadsstore-7168d.firebaseapp.com",
  projectId: "urbanthreadsstore-7168d",
  storageBucket: "urbanthreadsstore-7168d.firebasestorage.app",
  messagingSenderId: "457468107070",
  appId: "1:457468107070:web:f0496aea0986f9b22f346f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);