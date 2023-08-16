import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiO636OdFkzEn6B_d0bCN1jDH_LyPvPCA",
  authDomain: "mercurial-song-380107.firebaseapp.com",
  databaseURL:
    "https://mercurial-song-380107-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mercurial-song-380107",
  storageBucket: "mercurial-song-380107.appspot.com",
  messagingSenderId: "55816097998",
  appId: "1:55816097998:web:e2d4ad57fe574cb065809f",
  measurementId: "G-J6Z6XGWHK9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db =  getFirestore(app);