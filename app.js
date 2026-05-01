import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db   = getFirestore(app);

// ── UID ──────────────────────────────────────
let currentUID = null;

// ── Storage (Firestore แทน localStorage) ─────
const S = {
  // อ่านข้อมูล
  get: async (key) => {
    try {
      const ref = doc(db, "users", currentUID, "data", key);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data().value : null;
    } catch { return null; }
  },

  // บันทึกข้อมูล
  set: async (key, value) => {
    try {
      const ref = doc(db, "users", currentUID, "data", key);
      await setDoc(ref, { value });
    } catch (e) { console.error("set error", e); }
  },

  // ดึง keys ทั้งหมด
  keys: async () => {
    try {
      const col = collection(db, "users", currentUID, "data");
      const snap = await getDocs(col);
      return snap.docs.map(d => d.id);
    } catch { return []; }
  },

  // ลบ
  delete: async (key) => {
    try {
      await deleteDoc(doc(db, "users", currentUID, "data", key));
    } catch {}
  }
};

// ── Wrapper ให้โค้ดเดิมใช้ได้ (sync-style) ───
// เก็บ cache ไว้ใน memory เพื่อให้ทำงานเร็ว
const cache = {};

function cacheGet(key) {
  return cache[key] !== undefined ? cache[key] : null;
}

async function cacheSet(key, value) {
  cache[key] = value;
  await S.set(key, value);
}

// โหลดข้อมูลทั้งหมดจาก Firestore มาใส่ cache ก่อน
async function loadAllData() {
  try {
    const keys = await S.keys();
    await Promise.all(keys.map(async (key) => {
      const val = await S.get(key);
      cache[key] = val;
    }));
  } catch (e) { console.error("loadAllData error", e); }
}

// ── Override S ให้เป็น sync (ใช้ cache) ──────
window.SyncStorage = {
  get: (k) => cacheGet(k),
  set: (k, v) => { cache[k] = v; S.set(k, v); },
  keys: () => Object.keys(cache)
};

// ── Auth State ───────────────────────────────
onAuthStateChanged(auth, async (user) => {
  const authScreen = document.getElementById("authScreen");
  if (!authScreen) return;

  if (user) {
    currentUID = user.uid;
    authScreen.style.display = "none";

    // โหลดข้อมูลจาก Firestore ก่อน แล้วค่อย init
    await loadAllData();

    if (typeof window.init === "function") window.init(user);
  } else {
    currentUID = null;
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
  } catch (err) {
    const MSG = {
      "auth/user-not-found":       "ไม่พบบัญชีนี้",
      "auth/wrong-password":       "รหัสผ่านไม่ถูกต้อง",
      "auth/invalid-email":        "Email ไม่ถูกต้อง",
      "auth/invalid-credential":   "Email หรือรหัสผ่านไม่ถูกต้อง"
    };
    showError(MSG[err.code] || err.message);
  }
};

// ── Logout ────────────────────────────────────
window.doLogout = async function () {
  if (!confirm("ออกจากระบบ?")) return;
  Object.keys(cache).forEach(k => delete cache[k]);
  await signOut(auth);
};
