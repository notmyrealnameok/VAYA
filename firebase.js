import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhohUe9HTbLe_tz3Qar993xdTKG7_A8NY",
  authDomain: "vaya-monate.firebaseapp.com",
  projectId: "vaya-monate",
  storageBucket: "vaya-monate.appspot.com",
  messagingSenderId: "853620098217",
  appId: "1:853620098217:web:06efe293214249186d15b8",
  measurementId: "G-0N585XME0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, db, storage, doc, setDoc, getDoc };
