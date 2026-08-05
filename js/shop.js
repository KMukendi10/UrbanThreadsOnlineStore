import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {

  if (user) {

    // Display the user's email
    userEmail.textContent = user.email;

  } else {

    // User is not logged in
    window.location.href = "login.html";

  }

});

// Logout
logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "login.html";

  } catch (error) {

    console.error(error);

  }

});