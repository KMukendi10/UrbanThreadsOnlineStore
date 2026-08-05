// auth.js

import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ===========================
// HTML Elements
// ===========================

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const message = document.getElementById("message");

// ===========================
// Login
// ===========================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";

        setTimeout(() => {

            window.location.href = "../shop.html";

        }, 1000);

    } catch (error) {

        showError(error.code);

    }

});

// ===========================
// Create Account
// ===========================

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
        message.textContent =
            "Account created successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "../shop.html";

        }, 1000);

    } catch (error) {

        showError(error.code);

    }

});

// ===========================
// Friendly Error Messages
// ===========================

function showError(errorCode) {

    message.style.color = "#dc2626";

    switch (errorCode) {

        case "auth/invalid-email":
            message.textContent =
                "Please enter a valid email address.";
            break;

        case "auth/missing-email":
            message.textContent =
                "Please enter your email address.";
            break;

        case "auth/missing-password":
            message.textContent =
                "Please enter your password.";
            break;

        case "auth/invalid-credential":
            message.textContent =
                "Incorrect email or password.";
            break;

        case "auth/email-already-in-use":
            message.textContent =
                "An account with this email already exists.";
            break;

        case "auth/weak-password":
            message.textContent =
                "Password must be at least 6 characters long.";
            break;

        case "auth/network-request-failed":
            message.textContent =
                "Network error. Please check your internet connection.";
            break;

        case "auth/too-many-requests":
            message.textContent =
                "Too many attempts. Please try again later.";
            break;

        default:
            message.textContent =
                "Something went wrong. Please try again.";

    }

}