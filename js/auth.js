// auth.js

import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Get elements from the page
const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const message = document.getElementById("message");

// ----------------------------
// LOGIN
// ----------------------------
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    message.style.color = "green";
    message.textContent = "Login successful!";

  } catch (error) {

    message.style.color = "red";
    message.textContent = error.message;

  }
});

// ----------------------------
// SIGN UP
// ----------------------------
signupBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    message.style.color = "green";
    message.textContent = "Account created successfully!";

  } catch (error) {

    message.style.color = "red";
    message.textContent = error.message;

  }

});