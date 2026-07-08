import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjykUqlq1tqQzn75k3k_uwaJ-3m0NBq8Y",
  authDomain: "prodemic-216c4.firebaseapp.com",
  projectId: "prodemic-216c4",
  storageBucket: "prodemic-216c4.firebasestorage.app",
  messagingSenderId: "668303976590",
  appId: "1:668303976590:web:d5f072af4bfcc6c27201df",
  measurementId: "G-WQKDDRZND0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
