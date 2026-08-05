import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let currentUser = null;

// Check authentication
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        userEmail.textContent = user.email;

        loadCart();

    } else {

        window.location.href = "login.html";

    }

});

// Logout
logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

// Load cart
async function loadCart() {

    cartItems.innerHTML = "";

    let total = 0;

    const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "cart")
    );

    if (snapshot.empty) {

        cartItems.innerHTML = "<p>Your cart is empty.</p>";

        cartTotal.textContent = "Total: R0.00";

        return;

    }

    snapshot.forEach((item) => {

        const product = item.data();

        const subtotal = product.price * product.quantity;

        total += subtotal;

        cartItems.innerHTML += `

            <div class="cart-item">

                <h3>${product.name}</h3>

                <p>Price: R${product.price}</p>

                <p>Quantity: ${product.quantity}</p>

                <p>Subtotal: R${subtotal.toFixed(2)}</p>

                <button
                    class="remove-btn"
                    data-id="${item.id}">
                    Remove
                </button>

            </div>

        `;

    });

    cartTotal.textContent = `Total: R${total.toFixed(2)}`;

    addRemoveEvents();

}

// Remove item
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