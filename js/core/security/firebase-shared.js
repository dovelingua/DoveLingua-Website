// ============================================================
// DOVELINGUA — FIREBASE SHARED CONFIGURATION
// Location: /js/core/security/firebase-shared.js
// Purpose: Single source of truth for Firebase + shared config
// Import from any JS file: import { db, auth } from "../core/security/firebase-shared.js";
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
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential
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
  onSnapshot,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ============================================================
// FIREBASE CONFIGURATION
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ============================================================
// ADMIN EMAILS — never expose these in HTML
// ============================================================
const ADMIN_EMAILS = [
  'dovelingua78@gmail.com',
  'englishdove78@gmail.com'
];

// ============================================================
// ROLE-BASED REDIRECT ROUTES — updated for folder structure
// ============================================================
const ROUTES = {
  applicant: '../applicant/dashboard.html',
  student:   '../students/dashboard.html',
  teacher:   '../teachers/dashboard.html',
  staff:     '../staff/dashboard.html',
  admin:     '../admin/dashboard.html'
};

// ============================================================
// ERROR MESSAGES — Portuguese (Mozambique)
// ============================================================
const ERR = {
  'auth/email-already-in-use':  'Este email já está registado. Tente iniciar sessão.',
  'auth/invalid-email':         'O formato do email não é válido.',
  'auth/weak-password':         'Usa pelo menos 6 caracteres na palavra-passe.',
  'auth/network-request-failed':'Sem ligação à internet. Verifica a sua ligação.',
  'auth/user-not-found':        'Não encontrámos nenhuma conta com este email.',
  'auth/wrong-password':        'Palavra-passe incorrecta.',
  'auth/too-many-requests':     'Demasiadas tentativas. Aguarda alguns minutos.',
  'auth/invalid-credential':    'Email ou palavra-passe incorrectos. Se criou a conta com o Google, usa o botão "Continuar com o Google".'
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Get roles — supports both old single role and new roles array
export function getRoles(userData) {
  return userData?.roles || (userData?.role ? [userData.role] : ['applicant']);
}

// Get redirect path for a role
export function getRouteForRole(role) {
  return ROUTES[role] || '../applicant/dashboard.html';
}

// Get friendly error message
export function getErrorMessage(code) {
  return ERR[code] || 'Ocorreu um erro inesperado. Tenta novamente.';
}

// Auto-generate dynamic footer text
export function setDynamicFooter(elementId = 'dynamicFooter') {
  const el = document.getElementById(elementId);
  if (el) el.textContent = 'DoveLingua © ' + new Date().getFullYear() + ' - Todos os direitos reservados.';
}

// Auto-generate today's date in Portuguese
export function setDateToday(elementId = 'dateToday') {
  const el = document.getElementById(elementId);
  if (el) el.textContent = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ============================================================
// USER DOCUMENT FUNCTIONS
// ============================================================

export async function createUserDocument(uid, name, email, phone) {
  const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'applicant';
  await setDoc(doc(db, 'users', uid), {
    uid,
    fullName: name || 'Estudante',
    email,
    phone: phone || null,
    role: role,
    roles: [role],
    status: 'active',
    createdAt: serverTimestamp()
  });
  return role;
}

export async function getUserData(user) {
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  return snap.exists() ? snap.data() : null;
}

export async function isUserBlocked(user) {
  const data = await getUserData(user);
  return data?.isBlocked === true;
}

// ============================================================
// AUTH GUARD — call at top of every private page JS file
// Usage: await requireRole(auth, db, ['admin'], '../public/auth.html');
// ============================================================
export async function requireRole(authInstance, dbInstance, allowedRoles, redirectPath = '../public/auth.html') {
  return new Promise((resolve) => {
    onAuthStateChanged(authInstance, async (user) => {
      if (!user) {
        window.location.href = redirectPath;
        return;
      }
      const snap = await getDoc(doc(dbInstance, 'users', user.uid));
      if (!snap.exists()) {
        window.location.href = redirectPath;
        return;
      }
      const userData = snap.data();
      if (userData.isBlocked) {
        window.location.href = '../public/unauthorized.html';
        return;
      }
      const roles = getRoles(userData);
      const hasAccess = allowedRoles.some(r => roles.includes(r));
      if (!hasAccess) {
        window.location.href = '../public/unauthorized.html';
        return;
      }
      resolve({ user, userData, roles });
    });
  });
}

// ============================================================
// AUTH FUNCTIONS
// ============================================================
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

// ============================================================
// FIREBASE EXPORTS — everything a page JS file might need
// ============================================================
export {
  app,
  auth,
  db,
  provider,
  // Auth
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  // Firestore
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
  onSnapshot,
  orderBy,
  limit
};
