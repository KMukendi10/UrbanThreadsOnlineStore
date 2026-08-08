// The shop is browsable without an account — products load as soon as
// the page does, no auth check. The nav bar's Login/Logout state and
// cart-count badge are handled globally by navbar.js. Auth only comes
// into play right when a shopper clicks "Add" — if they're not signed
// in, they're sent to the login page and back here afterwards.

import { auth, db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { refreshCartCount } from "./navbar.js";
import { showToast } from "./toast.js";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");

let allProducts = [];
let selectedCategory = "All";
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// A category tile on the home page links here as shop.html?category=Hoodies
// — pick that category up and pre-select it before the first render.
const requestedCategory = new URLSearchParams(window.location.search).get("category");
if (requestedCategory) {
    selectedCategory = requestedCategory;
    document.querySelectorAll(".category-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === requestedCategory);
    });
}

loadProducts();

// ===========================
// Load Products (public)
// ===========================
async function loadProducts() {
    productsContainer.innerHTML = "<p>Loading products...</p>";
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        allProducts = [];
        querySnapshot.forEach((docSnap) => {
            allProducts.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        filterProducts();
    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = "<p>Unable to load products.</p>";
    }
}

// ===========================
// Display Products
// ===========================
function displayProducts(products) {
    productsContainer.innerHTML = "";
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                No products found.
            </div>
        `;
        return;
    }

    products.forEach((product) => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.imageURL}" alt="${product.name}">
                <div class="product-info">
                    <span class="product-category">
                        ${product.category}
                    </span>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-bottom">
                        <span class="product-price">
                            R${Number(product.price).toFixed(2)}
                        </span>
                        <button
                            type="button"
                            class="add-cart-btn"
                            data-id="${product.id}">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    addCartEvents();
}

// ===========================
// Search + Category Filter
// ===========================
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
        document
            .querySelectorAll(".category-btn")
            .forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedCategory = button.dataset.category;
        filterProducts();
    });
});

// ===========================
// Add To Cart (sign-in required)
// ===========================
function addCartEvents() {

    const buttons = document.querySelectorAll(".add-cart-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            if (!currentUser) {
                showToast("Please log in to add items to your cart");
                setTimeout(() => {
                    const next = "shop.html" + window.location.search;
                    window.location.href = `login.html?next=${encodeURIComponent(next)}`;
                }, 1400);
                return;
            }

            const product = allProducts.find(
                item => item.id === button.dataset.id
            );

            const cartRef = collection(
                db,
                "users",
                currentUser.uid,
                "cart"
            );

            const q = query(
                cartRef,
                where("productId", "==", product.id)
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
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    imageURL: product.imageURL,
                    category: product.category,
                    description: product.description,
                    quantity: 1
                });
            }

            await refreshCartCount(currentUser.uid);
            showToast(`${product.name} added to cart`);
        });
    });
}
