// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMGnMQBA5sHkGNOoZod-g4js5hnpFiATU",
  authDomain: "claiminsight-d8431.firebaseapp.com",
  projectId: "claiminsight-d8431",
  storageBucket: "claiminsight-d8431.firebasestorage.app",
  messagingSenderId: "934764085110",
  appId: "1:934764085110:web:0c65c0e86df9fc9a494457",
  measurementId: "G-9N8P1YV868"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
