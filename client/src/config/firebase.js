import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration from Vite environment variables
// Note: If you have your own Firebase project credentials, set them in client/.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_dummyKey_replaceWithYoursIfConfigured",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "research-hub-portal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "research-hub-portal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "research-hub-portal.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "91218642063",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:91218642063:web:researchhubapp",
};

// Initialize Firebase safely (avoid re-initialization in HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Triggers Firebase Google Popup sign-in
 * Returns standardized payload containing Firebase ID Token and user attributes
 */
export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken(true);

    return {
      success: true,
      idToken,
      email: result.user.email,
      name: result.user.displayName,
      avatar: result.user.photoURL,
      googleId: result.user.uid,
      rawUser: result.user,
    };
  } catch (error) {
    console.error("Firebase Google Sign-in Error:", error);

    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in cancelled: The Google popup was closed.");
    }
    if (error.code === "auth/popup-blocked") {
      throw new Error("Sign-in popup was blocked by your browser. Please allow popups for this site.");
    }
    if (error.code === "auth/invalid-api-key" || error.code === "auth/configuration-not-found") {
      throw new Error("Firebase project is not yet configured. Please set VITE_FIREBASE_API_KEY in client/.env");
    }

    throw new Error(error.message || "Failed to authenticate with Google via Firebase");
  }
};

export default app;
