// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAl9A_gXDKTB3N6U1f_Bh5FWrOsySjCJGo",
  authDomain: "dovelingua-site.firebaseapp.com",
  projectId: "dovelingua-site",
  storageBucket: "dovelingua-site.firebasestorage.app",
  messagingSenderId: "271742052334",
  appId: "1:271742052334:web:bc736373d7ea50001b50ff",
  measurementId: "G-N8ELT8SMYM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };