// Login page only. One card, two tabs (Login / Sign Up). Once Firebase
// confirms a session exists, redirects straight to "next" (or shop.html)
// so a logged-in user landing here bounces through instead of seeing the
// form again — this is also how the "sign in only when you add to cart"
// flow gets back to where the shopper was headed.

import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const formLogin = document.getElementById("form-login");
const formSignup = document.getElementById("form-signup");
const message = document.getElementById("message");

let redirected = false;

// ===========================
// Redirect once signed in
// ===========================
onAuthStateChanged(auth, (user) => {
    if (user && !redirected) {
        redirected = true;
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get("next") || "index.html";
    }
});

// ===========================
// Tabs
// ===========================
tabLogin.addEventListener("click", () => switchTab("login"));
tabSignup.addEventListener("click", () => switchTab("signup"));

function switchTab(which) {
    const isLogin = which === "login";
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabSignup.setAttribute("aria-selected", String(!isLogin));
    formLogin.hidden = !isLogin;
    formSignup.hidden = isLogin;
    message.textContent = "";
}

// ===========================
// Login
// ===========================
formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const submitBtn = formLogin.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        showError(error.code);
    } finally {
        submitBtn.disabled = false;
    }
});

// ===========================
// Sign Up
// ===========================
formSignup.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const submitBtn = formSignup.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        showError(error.code);
    } finally {
        submitBtn.disabled = false;
    }
});

// ===========================
// Friendly Error Messages
// ===========================
function showError(errorCode) {
    message.style.color = "#dc2626";

    switch (errorCode) {

        case "auth/invalid-email":
            message.textContent = "Please enter a valid email address.";
            break;

        case "auth/missing-email":
            message.textContent = "Please enter your email address.";
            break;

        case "auth/missing-password":
            message.textContent = "Please enter your password.";
            break;

        case "auth/invalid-credential":
            message.textContent = "Incorrect email or password.";
            break;

        case "auth/email-already-in-use":
            message.textContent = "An account with this email already exists.";
            break;

        case "auth/weak-password":
            message.textContent = "Password must be at least 6 characters long.";
            break;

        case "auth/network-request-failed":
            message.textContent = "Network error. Please check your internet connection.";
            break;

        case "auth/too-many-requests":
            message.textContent = "Too many attempts. Please try again later.";
            break;

        default:
            message.textContent = "Something went wrong. Please try again.";
    }
}
