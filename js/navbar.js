// Shared across every page (Home, Shop, Cart, Login, Profile) so the nav
// bar is always identical: Home / Shop / Cart links, theme toggle, and —
// driven by auth state — either a "Login" link, or (once signed in) a
// round avatar button that opens a Profile / Logout dropdown. Also keeps
// the blue cart-count badge live.
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
        const initial = (user.email || "?").charAt(0).toUpperCase();

        navAuth.innerHTML = `
            <div class="profile-menu" id="profile-menu">
                <button type="button" class="avatar-btn" id="avatar-btn" aria-haspopup="true" aria-expanded="false">${escapeHtml(initial)}</button>
                <div class="profile-dropdown" id="profile-dropdown" hidden>
                    <div class="profile-dropdown-email">${escapeHtml(user.email)}</div>
                    <a href="profile.html" class="profile-dropdown-item">Profile</a>
                    <button type="button" class="profile-dropdown-item" id="nav-logout-btn">Logout</button>
                </div>
            </div>
        `;

        wireProfileMenu();

        await refreshCartCount(user.uid);
    } else {

        navAuth.innerHTML = `<a href="${loginLinkHref()}" class="btn btn-outline">Login</a>`;
        if (cartCountEl) {
            cartCountEl.textContent = "0";
        }
    }
});

// Toggle the avatar dropdown, close it on outside click / Escape, wire Logout.
function wireProfileMenu() {
    const menu = document.getElementById("profile-menu");
    const avatarBtn = document.getElementById("avatar-btn");
    const dropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("nav-logout-btn");

    avatarBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = !dropdown.hidden;
        dropdown.hidden = isOpen;
        avatarBtn.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (event) => {
        if (!menu.contains(event.target)) {
            dropdown.hidden = true;
            avatarBtn.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            dropdown.hidden = true;
            avatarBtn.setAttribute("aria-expanded", "false");
        }
    });

    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
    });
}

// Builds a login link that carries the current page (and its query
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
