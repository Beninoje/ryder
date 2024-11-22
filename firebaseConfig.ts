// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNfYRFneUKRV9GfXchdxHZ08GGNIPFfms",
  authDomain: "ryder-a1a71.firebaseapp.com",
  projectId: "ryder-a1a71",
  storageBucket: "ryder-a1a71.firebasestorage.app",
  messagingSenderId: "1065733340464",
  appId: "1:1065733340464:web:6d8d2f1b2d6b42b20c1cf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)