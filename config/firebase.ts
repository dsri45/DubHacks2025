import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnPoshvjFrjFQX29gthAs4s4Ardnr_C0g",
    authDomain: "dubhacks25.firebaseapp.com",
    projectId: "dubhacks25",
    storageBucket: "dubhacks25.firebasestorage.app",
    messagingSenderId: "509381968381",
    appId: "1:509381968381:web:ffd207b082cf65dfb39994",
    measurementId: "G-VMTW2EX1L7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
// Use getAuth to avoid "already-initialized" error
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
