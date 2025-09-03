// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tumhara Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjeD0tAAcfmhuJC5HMrtxWXwSSXpHkd1c",
  authDomain: "flipkart-321b9.firebaseapp.com",
  projectId: "flipkart-321b9",
  storageBucket: "flipkart-321b9.firebasestorage.app",
  messagingSenderId: "469434114627",
  appId: "1:469434114627:web:0d7a1b2e2c15938750aaf6",
  measurementId: "G-8564Q9FWQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth aur Provider export
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
