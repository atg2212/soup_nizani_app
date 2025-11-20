import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
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

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
