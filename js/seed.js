// seed.js
// One-time script to populate the Firestore "products" collection.
// Run this once (via seed.html), then you can remove/ignore it.

import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const products = [
  {
    name: "Oversized Hoodie",
    price: 49.99,
    category: "Hoodies",
    description: "Soft cotton hoodie in oversized fit.",
    imageURL: "assets/products/hoodie-1.jpg"
  },
  {
    name: "Graphic Tee",
    price: 24.99,
    category: "T-shirts",
    description: "Cotton tee with bold streetwear print.",
    imageURL: "assets/products/tee-1.jpg"
  },
  {
    name: "Chunky Sneakers",
    price: 89.99,
    category: "Sneakers",
    description: "Statement sneakers with thick sole.",
    imageURL: "assets/products/sneaker-1.jpg"
  },
  {
    name: "Bucket Hat",
    price: 19.99,
    category: "Accessories",
    description: "Cotton bucket hat, one size fits most.",
    imageURL: "assets/products/hat-1.jpg"
  }
];

async function seedProducts() {
  const productsRef = collection(db, "products");

  for (const product of products) {
    try {
      const docRef = await addDoc(productsRef, product);
      console.log("Added product with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  console.log("Seeding complete.");
}

seedProducts();