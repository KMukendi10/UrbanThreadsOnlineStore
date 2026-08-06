import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

let currentUser = null;

// ===========================
// Authentication
// ===========================

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        userEmail.textContent = user.email;

        loadCart();

    } else {

        window.location.href = "login.html";

    }

});

// ===========================
// Logout
// ===========================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

// ===========================
// Load Cart
// ===========================

async function loadCart() {

    cartItems.innerHTML = "";

    let total = 0;

    const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "cart")
    );

    if (snapshot.empty) {

        cartItems.innerHTML = `

            <div class="empty-state">

                <h2>Your cart is empty.</h2>

                <p>Add some products from the shop.</p>

            </div>

        `;

        cartTotal.textContent = "Total: R0.00";

        checkoutBtn.disabled = true;

        return;

    }

    checkoutBtn.disabled = false;

    snapshot.forEach((item) => {

        const product = item.data();

        const subtotal = product.price * product.quantity;

        total += subtotal;

        cartItems.innerHTML += `

            <div class="cart-card fade-in">

                <img
                    src="${product.imageURL}"
                    alt="${product.name}"
                    class="cart-image"
                >

                <div class="cart-details">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p>Category: ${product.category}</p>

                    <div class="cart-price">

                        R${product.price.toFixed(2)}

                    </div>

                    <div class="quantity-controls">

                        <button
                            class="qty-btn decrease-btn"
                            data-id="${item.id}"
                            data-quantity="${product.quantity}">
                        </button>

                        <span class="quantity">

                            ${product.quantity}

                        </span>

                        <button
                            class="qty-btn increase-btn"
                            data-id="${item.id}"
                            data-quantity="${product.quantity}">

                            +

                        </button>

                    </div>

                    <p>

                        <strong>

                            Subtotal:
                            R${subtotal.toFixed(2)}

                        </strong>

                    </p>

                    <button
                        class="remove-btn"
                        data-id="${item.id}">

                        Remove Item

                    </button>

                </div>

            </div>

        `;

    });

    cartTotal.textContent = `Total: R${total.toFixed(2)}`;

    addQuantityEvents();

    addRemoveEvents();

}

// ===========================
// Quantity Buttons
// ===========================

function addQuantityEvents() {

    const increaseButtons = document.querySelectorAll(".increase-btn");

    const decreaseButtons = document.querySelectorAll(".decrease-btn");

    increaseButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const quantity = Number(button.dataset.quantity);

            await updateDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "cart",
                    button.dataset.id
                ),

                {
                    quantity: quantity + 1
                }

            );

            loadCart();

        });

    });

    decreaseButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const quantity = Number(button.dataset.quantity);

            if (quantity <= 1) {

                await deleteDoc(

                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "cart",
                        button.dataset.id
                    )

                );

            } else {

                await updateDoc(

                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "cart",
                        button.dataset.id
                    ),

                    {
                        quantity: quantity - 1
                    }

                );

            }

            loadCart();

        });

    });

}

// ===========================
// Remove Item
// ===========================

function addRemoveEvents() {

    const buttons = document.querySelectorAll(".remove-btn");

    buttons.forEach((button) => {

        button.addEventListener("click", async () => {

            await deleteDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "cart",
                    button.dataset.id
                )

            );

            loadCart();

        });

    });

}

// ===========================
// Checkout Button
// ===========================

checkoutBtn.addEventListener("click", () => {

    alert("Checkout page coming soon!");

});