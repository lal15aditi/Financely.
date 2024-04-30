// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdO6MPQoWId66i7v6n6LNYtKAy4H4d7dg",
  authDomain: "financely-f79b5.firebaseapp.com",
  projectId: "financely-f79b5",
  storageBucket: "financely-f79b5.appspot.com",
  messagingSenderId: "1062220935204",
  appId: "1:1062220935204:web:82c5c3f12f28a45a1ee8b1",
  measurementId: "G-JENK26QMFY"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);





export { db, auth, provider, doc, setDoc , };
