import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import type { User } from "firebase/auth"; // Tipo de usuario de Firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";

// Proveedor de Google
const googleProvider = new GoogleAuthProvider();

/**
 * Login con Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // result.user es el usuario autenticado
    return result.user;
  } catch (error) {
    console.error("Error en login con Google:", error);
    throw error;
  }
};

// Instancia de Firebase Auth
export const auth = getAuth(app);

/**
 * Registrar un usuario con email y password
 * @param email string
 * @param password string
 * @returns Promise<UserCredential>
 */
export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Login de usuario con email y password
 * @param email string
 * @param password string
 * @returns Promise<UserCredential>
 */
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logout de usuario
 * @returns Promise<void>
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Observador de autenticación
 * @param callback función que recibe User | null
 * @returns función para cancelar el observador
 */
export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (currentUser) => {
    callback(currentUser);
  });
};

/**
 * Enviar email de restablecimiento de contraseña
 */
export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Enviar email de verificación al usuario actual
 */
export const verifyEmail = (user: User) => {
  return sendEmailVerification(user);
};


