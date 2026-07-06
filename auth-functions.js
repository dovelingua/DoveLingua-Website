// auth-functions.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const provider = new GoogleAuthProvider();

// Admin emails configuration
const ADMIN_EMAILS = ['your-admin-email@example.com', 'second-admin@example.com'];

// Route mapping
const ROUTES = { 
  applicant: 'application-status.html', 
  student: 'student-dashboard.html', 
  teacher: 'teacher-dashboard.html', 
  staff: 'staff-payments.html', 
  admin: 'admin-dashboard.html' 
};

// Error messages
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

export function getErrorMessage(code) {
  return ERR[code] || 'Ocorreu um erro inesperado. Tenta novamente.';
}

// Create user document with role assignment
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

// Get user role and redirect
export async function getUserRole(user) {
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) return null;
  return snap.data();
}

// Check if user is blocked
export async function isUserBlocked(user) {
  if (!user) return false;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) return false;
  return snap.data().isBlocked === true;
}

// Auth functions
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

// Utility: Get current auth instance
export { auth, db };