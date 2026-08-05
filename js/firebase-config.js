// firebase-config.js
// Initializes Firebase and exports the pieces other files need (auth, db)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDm_R-lKlF0nLx0evN7sRJ0cBug4nHFT8c",
  authDomain: "urbanthreadsonlinestore-f75f4.firebaseapp.com",
  projectId: "urbanthreadsonlinestore-f75f4",
  storageBucket: "urbanthreadsonlinestore-f75f4.firebasestorage.app",
  messagingSenderId: "732220252091",
  appId: "1:732220252091:web:fa1b569ab74bab4f726e9e",
  measurementId: "G-QNYHVCDX0N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);