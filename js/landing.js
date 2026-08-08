// Home page is public (no login required to browse), so this only reads
// the "products" collection and renders a small preview grid — it doesn't
// touch auth or the cart. Card markup mirrors shop.js's product-card so
// the two pages look identical.

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    limit
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const featuredGrid = document.getElementById("featured-grid");

if (featuredGrid) {
    loadFeatured();
}

// ===========================
// Load Featured Products
// ===========================
async function loadFeatured() {
    try {
        const snapshot = await getDocs(
            query(collection(db, "products"), limit(4))
        );

        const products = [];
        snapshot.forEach((docSnap) => {
            products.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });
        displayFeatured(products);
    } catch (error) {

        console.error(error);
        featuredGrid.innerHTML = `
            <p class="empty-state">Unable to load products.</p>
        `;
    }
}

// ===========================
// Display Featured Products
// ===========================
function displayFeatured(products) {

    if (products.length === 0) {
        featuredGrid.innerHTML = `
            <p class="empty-state">New drops coming soon.</p>
        `;
        return;
    }

    featuredGrid.innerHTML = "";
    products.forEach((product) => {
        featuredGrid.innerHTML += `
            <div class="product-card fade-in">
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
                        <a href="shop.html" class="btn btn-outline">
                            View
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}
