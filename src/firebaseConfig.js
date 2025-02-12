// Frontened/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getDatabase, ref, set, update, onValue, push } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1ZIO4xo0GTTHbfz2fpqODHadVch9f7Ts",
  authDomain: "college-fde10.firebaseapp.com",
  projectId: "college-fde10",
  storageBucket: "college-fde10.appspot.com",  // Fixed storageBucket
  messagingSenderId: "217868945359",
  appId: "1:217868945359:web:82686df410f3efdce6f4ba",
  databaseURL: "https://college-fde10-default-rtdb.firebaseio.com/", // Ensure this URL is used
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Export the services
export { auth, db, database, ref, set, update, onValue, push };
