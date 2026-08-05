// firebase-config.js

// Import the Firebase services we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk3tGMohIQKMj_mRp6ZlOwSEcnFtZKqZ4",
  authDomain: "urbanthreadsstore-1a093.firebaseapp.com",
  projectId: "urbanthreadsstore-1a093",
  storageBucket: "urbanthreadsstore-1a093.firebasestorage.app",
  messagingSenderId: "268375787140",
  appId: "1:268375787140:web:dd685947b8060f21cca4d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);