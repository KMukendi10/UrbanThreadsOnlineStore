import { db } from "./firebase-config.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

async function testFirestore() {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      name: "Oversized Hoodie",
      price: 49.99,
      category: "Hoodies",
      description: "Soft cotton hoodie in oversized fit.",
      imageURL: "https://picsum.photos/300/400"
    });

    console.log("✅ Product added successfully!");
    console.log("Document ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error adding product:", error);
  }
}

testFirestore();