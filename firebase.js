// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAERGNInu8jCpCYbsfRHMx7d8gqbgzdFtU",
  authDomain: "flashcards-7fda3.firebaseapp.com",
  projectId: "flashcards-7fda3",
  storageBucket: "flashcards-7fda3.appspot.com",
  messagingSenderId: "117196330273",
  appId: "1:117196330273:web:534902b914def6e6501a60",
  measurementId: "G-32B34PZFWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app, db}