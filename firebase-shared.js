// firebase-shared.js
// ============================================================
// SINGLE SOURCE OF TRUTH - DOVELINGUA FIREBASE SETUP
// All pages import from this file
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ============================================================
// FIREBASE CONFIGURATION - FROM PROJECT DECISIONS LOG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAl9A_gXDKTB3N6U1f_Bh5FWrOsySjCJGo",
  authDomain: "dovelingua-site.firebaseapp.com",
  projectId: "dovelingua-site",
  storageBucket: "dovelingua-site.firebasestorage.app",
  messagingSenderId: "271742052334",
  appId: "1:271742052334:web:bc736373d7ea50001b50ff",
  measurementId: "G-N8ELT8SMYM"
};

// Initialize Firebase (ONLY ONCE - here)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ============================================================
// CONFIGURATION
// ============================================================
const ADMIN_EMAILS = ['dovelingua78@gmail.com', 'englishdove78@gmail.com'];

const ROUTES = { 
  applicant: 'application-status.html', 
  student: 'student-dashboard.html', 
  teacher: 'teacher-dashboard.html', 
  staff: 'staff-payments.html', 
  admin: 'admin-dashboard.html' 
};

const ERR = {
  'auth/email-already-in-use': 'Este email já está registado. Tente iniciar sessão.',
  'auth/invalid-email': 'O formato do email não é válido.',
  'auth/weak-password': 'Usa pelo menos 6 caracteres na palavra-passe.',
  'auth/network-request-failed': 'Sem ligação à internet. Verifica a sua ligação.',
  'auth/user-not-found': 'Não encontrámos nenhuma conta com este email.',
  'auth/wrong-password': 'Palavra-passe incorrecta.',
  'auth/too-many-requests': 'Demasiadas tentativas. Aguarda alguns minutos.',
  'auth/invalid-credential': 'Email ou palavra-passe incorrectos. Se criou a conta com o Google, usa o botão "Continuar com o Google".'
};

// ============================================================
// EXPORTED FUNCTIONS - Available to ALL pages
// ============================================================

// Error handling
export function getErrorMessage(code) {
  return ERR[code] || 'Ocorreu um erro inesperado. Tenta novamente.';
}

// User document management
export async function createUserDocument(uid, name, email, phone) {
  const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'applicant';
  await setDoc(doc(db, 'users', uid), {
    uid,
    fullName: name || 'Aluno',
    email,
    phone: phone || null,
    role: role,
    status: 'active',
    createdAt: serverTimestamp()
  });
  return role;
}

export async function getUserData(user) {
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function isUserBlocked(user) {
  if (!user) return false;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) return false;
  return snap.data().isBlocked === true;
}

export function getRoles(userData) {
  return userData?.roles || (userData?.role ? [userData.role] : ['applicant']);
}

// Authentication functions
export function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  return signOut(auth);
}

export function sendPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export function updateUserProfile(user, data) {
  return updateProfile(user, data);
}

export function authStateListener(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getRouteForRole(role) {
  return ROUTES[role] || 'application-status.html';
}

// Export Firebase instances directly
export { 
  app, 
  auth, 
  db, 
  provider,
  // Firestore methods
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot
};
