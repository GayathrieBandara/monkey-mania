// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBEWDEdjzpQdv7aTljtV92Kf7eNzUSqDY",
  authDomain: "monkeymania-b9251.firebaseapp.com",
  projectId: "monkeymania-b9251",
  storageBucket: "monkeymania-b9251.firebasestorage.app",
  messagingSenderId: "588177887146",
  appId: "1:588177887146:web:6302541e48b7181751a5d3",
  measurementId: "G-3JKE8ZTVR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
