// If nobody's signed in, shows the #cart-gate panel with a "log in / sign
// up" prompt instead of bouncing the visitor straight to the login page —
// same pattern as add-to-cart on the shop page.
// Quantity +/- and remove update Firestore, then patch only the affected
// row and the totals in the DOM — the list is never wiped and rebuilt, so
// there's no flash that looks like the page reloading.

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import { refreshCartCount } from "./navbar.js";
import { showToast } from "./toast.js";

const gate = document.getElementById("cart-gate");
const layout = document.getElementById("cart-layout");
const cartList = document.getElementById("cart-list");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal = document.getElementById("summary-total");
const checkoutBtn = document.getElementById("checkout-btn");

let currentUser = null;

// Local mirror of what's in Firestore, keyed by cart doc id, so quantity
// changes can recompute totals without a fresh read every time.
let items = new Map();

// ===========================
// Authentication
// ===========================
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        gate.hidden = true;
        layout.hidden = false;
        loadCart();
    } else {
        currentUser = null;
        gate.hidden = false;
        layout.hidden = true;
    }
});

// ===========================
// Load Cart (full render — only happens once per visit/login)
// ===========================
async function loadCart() {
    const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "cart")
    );
    items = new Map();
    snapshot.forEach((item) => {
        items.set(item.id, item.data());
    });
    renderCart();
}

function renderCart() {
    if (items.size === 0) {
        cartList.innerHTML = `
            <div class="empty-state">
                <h2>Your cart is empty.</h2>
                <p>Add some products from the shop.</p>
            </div>
        `;
        checkoutBtn.disabled = true;
        updateTotals();
        return;
    }
    checkoutBtn.disabled = false;
    cartList.innerHTML = "";
    items.forEach((product, id) => {
        cartList.insertAdjacentHTML("beforeend", cartRowHtml(id, product));
    });

    addRowEvents();
    updateTotals();
}

function cartRowHtml(id, product) {
    return `
        <div class="cart-row" data-row="${id}">
            <img src="${product.imageURL}" alt="${product.name}">
            <div>
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-meta">${product.category}</div>
                <div class="cart-item-price">R${product.price.toFixed(2)}</div>
            </div>
            <div class="qty-control">
                <button type="button" class="decrease-btn" data-id="${id}">−</button>
                <span class="quantity" data-id="${id}">${product.quantity}</span>
                <button type="button" class="increase-btn" data-id="${id}">+</button>
            </div>
            <button type="button" class="remove-link" data-id="${id}">Remove</button>
        </div>
    `;
}

// ===========================
// Quantity + Remove (in-place, no full re-render)
// ===========================
function addRowEvents() {
    cartList.querySelectorAll(".increase-btn").forEach((button) => {
        button.addEventListener("click", () => changeQuantity(button.dataset.id, 1));
    });
    cartList.querySelectorAll(".decrease-btn").forEach((button) => {
        button.addEventListener("click", () => changeQuantity(button.dataset.id, -1));
    });

    cartList.querySelectorAll(".remove-link").forEach((button) => {
        button.addEventListener("click", () => removeItem(button.dataset.id));
    });
}

async function changeQuantity(id, delta) {
    const product = items.get(id);
    if (!product) {
        return;
    }

    const nextQuantity = product.quantity + delta;
    if (nextQuantity <= 0) {
        await removeItem(id);
        return;
    }

    await updateDoc(
        doc(db, "users", currentUser.uid, "cart", id),
        { quantity: nextQuantity }
    );
    product.quantity = nextQuantity;
    const qtyEl = cartList.querySelector(`.quantity[data-id="${id}"]`);
    if (qtyEl) {
        qtyEl.textContent = nextQuantity;
    }

    updateTotals();
    await refreshCartCount(currentUser.uid);
}

async function removeItem(id) {

    await deleteDoc(
        doc(db, "users", currentUser.uid, "cart", id)
    );
    items.delete(id);
    const row = cartList.querySelector(`[data-row="${id}"]`);
    if (row) {
        row.remove();
    }

    if (items.size === 0) {
        renderCart();
    } else {
        updateTotals();
    }

    await refreshCartCount(currentUser.uid);
    showToast("Item removed from cart");
}

// ===========================
// Totals
// ===========================
function updateTotals() {

    let total = 0;
    items.forEach((product) => {

        total += product.price * product.quantity;
    });

    summarySubtotal.textContent = `R${total.toFixed(2)}`;
    summaryTotal.textContent = `R${total.toFixed(2)}`;
}

// ===========================
// Checkout Button
// ===========================
checkoutBtn.addEventListener("click", () => {
    showToast("Checkout page coming soon!");
});
