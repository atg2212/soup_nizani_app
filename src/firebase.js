// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhnLi0ovxf1Kf4riTpJQadC2IIZFx2uts",
    authDomain: "nizanimhanuka.firebaseapp.com",
    projectId: "nizanimhanuka",
    storageBucket: "nizanimhanuka.firebasestorage.app",
    messagingSenderId: "263974654226",
    appId: "1:263974654226:web:250fdbd107170cbadc63cb",
    measurementId: "G-GKEQ5GRSG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
