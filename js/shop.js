import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const productsContainer = document.getElementById("products");

// ---------------------------
// Authentication
// ---------------------------

onAuthStateChanged(auth, (user) => {

  if (user) {
    userEmail.textContent = user.email;
    loadProducts();
  } else {
    window.location.href = "login.html";
  }

});

// ---------------------------
// Logout
// ---------------------------

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

// ---------------------------
// Load Products
// ---------------------------

async function loadProducts() {

  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    productsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {

      const product = doc.data();

      productsContainer.innerHTML += `
      
        <div class="product-card">

            <img src="${product.imageURL}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <h4>R${product.price}</h4>

            <button>Add to Cart</button>

        </div>

      `;

    });

  } catch (error) {

    console.error(error);

    productsContainer.innerHTML =
      "<p>Unable to load products.</p>";

  }

}