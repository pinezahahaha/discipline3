// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyBAvc6p3LxQlFjo-brEFpQa_kagcphdY44",
  authDomain: "discipline-os-9502b.firebaseapp.com",
  projectId: "discipline-os-9502b",
  storageBucket: "discipline-os-9502b.appspot.com",
  messagingSenderId: "561241359867",
  appId: "1:561241359867:web:843d17cebae639b4b9375e",
  measurementId: "G-4FVRR5V7R2"
};

// init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ================= REGISTER =================
window.doRegister = function () {
  const email = document.getElementById("loginUsername").value;
  const password = document.getElementById("regPassword").value;

  if (password.length < 6) {
    alert("รหัสต้องมากกว่า 6 ตัว");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("สมัครสำเร็จ");
    })
    .catch((error) => {
      alert(error.message);
    });
};


// ================= LOGIN =================
window.doLogin = function () {
  const email = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("ล็อกอินสำเร็จ");
      location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
};


// ================= LOGOUT =================
window.doLogout = function () {
  signOut(auth);
};


// ================= CHECK LOGIN =================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Login อยู่:", user.email);

    // 🔥 ซ่อนหน้า login (ถ้ามี id นี้)
    const authScreen = document.getElementById("authScreen");
    if (authScreen) authScreen.style.display = "none";

  } else {
    console.log("ยังไม่ได้ login");
  }
});
