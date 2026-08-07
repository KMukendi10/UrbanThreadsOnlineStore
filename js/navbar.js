// navbar.js
//
// Shared across every page (Home, Shop, Cart, Login) so the nav bar is
// always identical: Home / Shop / Cart links, theme toggle, and — driven
// by auth state — either a "Login" link or the signed-in user's email
// with a Logout button. Also keeps the blue cart-count badge live.
//
// Browsing (Shop) never requires login; only actions like adding to the
// cart do, which is handled where that action happens, not here.

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const navAuth = document.getElementById("nav-auth");
const cartCountEl = document.getElementById("cart-count");

onAuthStateChanged(auth, async (user) => {

    if (user) {

        navAuth.innerHTML = `
            <span class="user-email">${escapeHtml(user.email)}</span>
            <button type="button" class="btn btn-outline" id="nav-logout-btn">Logout</button>
        `;

        document.getElementById("nav-logout-btn").addEventListener("click", async () => {

            await signOut(auth);
            window.location.href = "index.html";

        });

        await refreshCartCount(user.uid);

    } else {

        navAuth.innerHTML = `<a href="${loginLinkHref()}" class="btn btn-outline">Login</a>`;

        if (cartCountEl) {

            cartCountEl.textContent = "0";

        }

    }

});

// Builds a login link that carries the current page (and its query
// string, e.g. a shop category filter) as ?next=..., so auth.js can send
// the shopper right back after they sign in.
function loginLinkHref() {

    const current = window.location.pathname.split("/").pop() || "index.html";

    if (current === "login.html") {

        return "login.html";

    }

    const next = current + window.location.search;

    return `login.html?next=${encodeURIComponent(next)}`;

}

// ===========================
// Cart Count Badge
// ===========================
// Exported so shop.js / cart.js can refresh the badge right after they
// add, update, or remove a cart item — no need to wait for the next
// auth-state tick.

export async function refreshCartCount(uid) {

    if (!cartCountEl) {

        return;

    }

    const snapshot = await getDocs(
        collection(db, "users", uid, "cart")
    );

    let total = 0;

    snapshot.forEach((docSnap) => {

        total += docSnap.data().quantity || 0;

    });

    cartCountEl.textContent = total;

}

function escapeHtml(str) {

    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;

}
