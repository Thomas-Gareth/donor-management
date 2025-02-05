import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1n4cw7jL6oGysUv_7B0i0xg11s6ilIFw",
  authDomain: "nonprofit-platform.firebaseapp.com",
  projectId: "nonprofit-platform",
  storageBucket: "nonprofit-platform.firebasestorage.app",
  messagingSenderId: "905308026497",
  appId: "1:905308026497:web:0a42ce97f896d499433f80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



signInAnonymously(auth)
  .then((userCredential) => {
    console.log("Signed in anonymously:", userCredential.user);
  })
  .catch((error) => console.error("Auth error:", error));


