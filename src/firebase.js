import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtLdLl3PJx44hVEuoynXdph0yNg1_v2dU",
  authDomain: "project-1-d279b.firebaseapp.com",
  projectId: "project-1-d279b",
  storageBucket: "project-1-d279b.firebasestorage.app",
  messagingSenderId: "506328034919",
  appId: "1:506328034919:web:e4b0646d051283c57eeec2",
  measurementId: "G-XC164GB6KJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };