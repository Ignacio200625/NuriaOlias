import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBnCsHYz9_-wa7pcl-E5eHAo-JWTCQeCM",
    authDomain: "peluqueria-app-26873.firebaseapp.com",
    projectId: "peluqueria-app-26873",
    storageBucket: "peluqueria-app-26873.firebasestorage.app",
    messagingSenderId: "1085240722207",
    appId: "1:1085240722207:web:b5ea898e4b677ea708a62a",
    measurementId: "G-N3TNB4L2RG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
