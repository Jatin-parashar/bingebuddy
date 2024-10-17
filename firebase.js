import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvZyxOHzqdvRQSwA6N1j5zRYJPy8JF1ZI",
  authDomain: "movieapp0review.firebaseapp.com",
  databaseURL: "https://movieapp0review-default-rtdb.firebaseio.com",
  projectId: "movieapp0review",
  storageBucket: "movieapp0review.appspot.com",
  messagingSenderId: "91002567278",
  appId: "1:91002567278:web:63736944abb12a1747847f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app); // Add this line

export { app, database }; // Export the database reference
