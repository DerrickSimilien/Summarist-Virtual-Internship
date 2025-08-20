// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBQYZNZ43IV8lSHgd2DdD7Iyb5mS6Ouhe0",
  authDomain: "summarist-c39e8.firebaseapp.com",
  projectId: "summarist-c39e8",
  storageBucket: "summarist-c39e8.firebasestorage.app",
  messagingSenderId: "1046869287676",
  appId: "1:1046869287676:web:a4a05b71ecfc96cfdded79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;