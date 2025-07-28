import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage, ref as sRef } from 'firebase/storage'; // alias để tránh trùng với database `ref`
import { getFirestore } from 'firebase/firestore';

// ✅ Cấu hình Firebase - KHÔNG để rỗng biến môi trường
const firebaseConfig = {
  apiKey: 'AIzaSyBKY8fO-Z9ORGWhG63FcImgjN_9hPTjGvg',
  authDomain: 'foodie-app-ad61c.firebaseapp.com',
  databaseURL: 'https://foodie-app-ad61c-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'foodie-app-ad61c',
  storageBucket: 'foodie-app-ad61c.appspot.com',
  messagingSenderId: '756260821602',
  appId: '1:756260821602:web:c92c72bcca22157a12cf3b',
};
// ✅ Khởi tạo Firebase App (tránh khởi tạo nhiều lần)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Export Firebase Services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// ✅ Export ref alias cho Firebase Storage
export { sRef };

// ✅ Export URL dùng cho fetch API nếu bạn dùng REST
export const FIREBASE_API_KEY = firebaseConfig.apiKey;
export const REALTIME_DB_URL = firebaseConfig.databaseURL;
export const AUTH_LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
export const AUTH_REGISTER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;

