// Same gate pattern as cart.js — signed-out visitors see a log-in prompt
// instead of getting bounced away immediately.

import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const gate = document.getElementById("profile-gate");
const card = document.getElementById("profile-card");
const avatar = document.getElementById("profile-avatar-large");
const emailEl = document.getElementById("profile-email");
const joinedEl = document.getElementById("profile-joined");
const logoutBtn = document.getElementById("profile-logout-btn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        gate.hidden = true;
        card.hidden = false;

        avatar.textContent = (user.email || "?").charAt(0).toUpperCase();
        emailEl.textContent = user.email;

        const joined = user.metadata && user.metadata.creationTime
            ? new Date(user.metadata.creationTime).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })
            : null;

        joinedEl.textContent = joined ? `Member since ${joined}` : "";
    } else {
        gate.hidden = false;
        card.hidden = true;
    }
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});
