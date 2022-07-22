import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const API_KEY = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: "AIzaSyAdNBfp1Q4umrMm7BH7-RrbG5q9sdAma8o",
  authDomain: "e-mart-12026.firebaseapp.com",
  projectId: "e-mart-12026",
  storageBucket: "e-mart-12026.appspot.com",
  messagingSenderId: "93883011097",
  appId: "1:93883011097:web:5283203b634c1169f05a88",
  measurementId: "G-61WRQ3C1VM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);

export default fireDB;
