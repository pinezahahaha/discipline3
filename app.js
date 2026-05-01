// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAvc6p3LxQlFjo-brEFpQa_kagcphdY44",
  authDomain: "discipline-os-9502b.firebaseapp.com",
  projectId: "discipline-os-9502b",
  storageBucket: "discipline-os-9502b.firebasestorage.app",
  messagingSenderId: "561241359867",
  appId: "1:561241359867:web:843d17cebae639b4b9375e",
  measurementId: "G-4FVRR5V7R2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
