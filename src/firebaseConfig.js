// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getDatabase, ref, set, update } from "firebase/database"; 

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1ZIO4xo0GTTHbfz2fpqODHadVch9f7Ts",
  authDomain: "college-fde10.firebaseapp.com",
  projectId: "college-fde10",
  storageBucket: "college-fde10.firebasestorage.app",
  messagingSenderId: "217868945359",
  appId: "1:217868945359:web:82686df410f3efdce6f4ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);  // Firestore database
const auth = getAuth(app);      // Firebase authentication
const database = getDatabase(app);  // Realtime database

// Export the services for use in other files
export { auth, db, database, ref, set, update };
