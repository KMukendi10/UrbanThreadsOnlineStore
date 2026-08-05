// // firebase-config.js
// // Initializes Firebase and exports the pieces other files need (auth, db)

// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDm_R-lKlF0nLx0evN7sRJ0cBug4nHFT8c",
//   authDomain: "urbanthreadsonlinestore-f75f4.firebaseapp.com",
//   projectId: "urbanthreadsonlinestore-f75f4",
//   storageBucket: "urbanthreadsonlinestore-f75f4.firebasestorage.app",
//   messagingSenderId: "732220252091",
//   appId: "1:732220252091:web:fa1b569ab74bab4f726e9e",
//   measurementId: "G-QNYHVCDX0N"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

//<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC_ndngIquxt1iwmfAc7D0W9Wql8fCYYkA",
    authDomain: "urbanthreadsonlinestore-4e1ff.firebaseapp.com",
    projectId: "urbanthreadsonlinestore-4e1ff",
    storageBucket: "urbanthreadsonlinestore-4e1ff.firebasestorage.app",
    messagingSenderId: "676347200701",
    appId: "1:676347200701:web:c182b3a7ee6d08d922e3d4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//</script>