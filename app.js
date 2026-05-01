import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Firebase Config ──────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBAvc6p3LxQlFjo-brEFpQa_kagcphdY44",
  authDomain: "discipline-os-9502b.firebaseapp.com",
  projectId: "discipline-os-9502b",
  storageBucket: "discipline-os-9502b.appspot.com",
  messagingSenderId: "561241359867",
  appId: "1:561241359867:web:843d17cebae639b4b9375e"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── Auth State ───────────────────────────────
onAuthStateChanged(auth, (user) => {
  const authScreen = document.getElementById("authScreen");
  if (!authScreen) return;

  if (user) {
    authScreen.style.display = "none";
    // ถ้ามี init() ใน global scope ให้เรียก
    if (typeof window.init === "function") window.init(user);
  } else {
    authScreen.style.display = "flex";
  }
});

// ── Register ─────────────────────────────────
window.doRegister = async function () {
  const email    = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value;
  const errorEl  = document.getElementById("registerError");

  const showError = (msg) => {
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add("show"); }
    else alert(msg);
  };

  if (!email || !email.includes("@")) return showError("กรุณาใส่ email ที่ถูกต้อง");
  if (!password || password.length < 6) return showError("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged จะจัดการต่อเอง
  } catch (err) {
    const MSG = {
      "auth/email-already-in-use": "Email นี้ถูกใช้แล้ว",
      "auth/invalid-email":        "Email ไม่ถูกต้อง",
      "auth/weak-password":        "รหัสผ่านอ่อนเกินไป"
    };
    showError(MSG[err.code] || err.message);
  }
};

// ── Login ─────────────────────────────────────
window.doLogin = async function () {
  const email    = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  const errorEl  = document.getElementById("loginError");

  const showError = (msg) => {
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add("show"); }
    else alert(msg);
  };

  if (!email || !password) return showError("กรุณาใส่ email และรหัสผ่าน");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged จะจัดการต่อเอง
  } catch (err) {
    const MSG = {
      "auth/user-not-found":   "ไม่พบบัญชีนี้",
      "auth/wrong-password":   "รหัสผ่านไม่ถูกต้อง",
      "auth/invalid-email":    "Email ไม่ถูกต้อง",
      "auth/invalid-credential": "Email หรือรหัสผ่านไม่ถูกต้อง"
    };
    showError(MSG[err.code] || err.message);
  }
};

// ── Logout ────────────────────────────────────
window.doLogout = async function () {
  if (!confirm("ออกจากระบบ?")) return;
  await signOut(auth);
  // onAuthStateChanged จะแสดง authScreen เอง
};
