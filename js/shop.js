import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const cartCount = document.getElementById("cart-count");

let currentUser = null;
let allProducts = [];
let selectedCategory = "All";

// Authentication
onAuthStateChanged(auth, async (user) => {

    if (user) {

        currentUser = user;

        userEmail.textContent = user.email;

        await loadProducts();

        await loadCartCount();

    } else {

        window.location.href = "login.html";

    }

});

// Logout
logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

// Load Products
async function loadProducts() {

    productsContainer.innerHTML = "<p>Loading products...</p>";

    try {

        const querySnapshot = await getDocs(collection(db, "products"));

        allProducts = [];

        querySnapshot.forEach((doc) => {

            allProducts.push({

                id: doc.id,

                ...doc.data()

            });

        });

        filterProducts();

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = "<p>Unable to load products.</p>";

    }

}

// Display Products
function displayProducts(products) {

    productsContainer.innerHTML = "";

    if (products.length === 0) {

        productsContainer.innerHTML = "<p>No products found.</p>";

        return;

    }

    products.forEach((product) => {

        productsContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.imageURL}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <h4>R${Number(product.price).toFixed(2)}</h4>

            <button
                class="add-cart-btn"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${product.price}">

                Add to Cart

            </button>

        </div>

        `;

    });

    addCartEvents();

}

// Filter Products
function filterProducts() {

    const search = searchInput.value.toLowerCase().trim();

    const filteredProducts = allProducts.filter((product) => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}

searchInput.addEventListener("input", filterProducts);

document.querySelectorAll(".category-btn").forEach((button) => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();

    });

});

// Load Cart Count
async function loadCartCount() {

    const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "cart")
    );

    let totalItems = 0;

    snapshot.forEach((doc) => {

        totalItems += doc.data().quantity;

    });

    cartCount.textContent = totalItems;

}

// Add To Cart
function addCartEvents() {

    const buttons = document.querySelectorAll(".add-cart-btn");

    buttons.forEach((button) => {

        button.addEventListener("click", async () => {

            const cartRef = collection(
                db,
                "users",
                currentUser.uid,
                "cart"
            );

            const q = query(
                cartRef,
                where("productId", "==", button.dataset.id)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {

                const existingDoc = snapshot.docs[0];

                await updateDoc(
                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "cart",
                        existingDoc.id
                    ),
                    {
                        quantity: existingDoc.data().quantity + 1
                    }
                );

            } else {

                await addDoc(cartRef, {

                    productId: button.dataset.id,
                    name: button.dataset.name,
                    price: Number(button.dataset.price),
                    quantity: 1

                });

            }

            await loadCartCount();

            alert("Cart updated!");

        });

    });

}