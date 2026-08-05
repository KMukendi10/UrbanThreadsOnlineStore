import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, (user) => {

  if (user) {

    userEmail.textContent = user.email;

  } else {

    window.location.href = "login.html";

  }

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});