// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBd_sH_ieS8-D8kAPKt9KN0Ff_ouDknIWk",
  authDomain: "financely-pft.firebaseapp.com",
  projectId: "financely-pft",
  storageBucket: "financely-pft.appspot.com",
  messagingSenderId: "26803030005",
  appId: "1:26803030005:web:f184f47e268a2b3f6c42bc",
  measurementId: "G-44NG90T0LF"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);





export { db, auth, provider, doc, setDoc , };