import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYuZ9fcHfjJWvIi2_3cij17YbjT0ujYYY",
  authDomain: "room-seva.firebaseapp.com",
  projectId: "room-seva",
  storageBucket: "room-seva.appspot.com",
  messagingSenderId: "352632232952",
  appId: "1:352632232952:web:222e58318bfaf00dc5540d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// db
export const db = getFirestore();
export const storage = getStorage();

// create the user in firestore db when the user logs in with oauth

export const createUserInFirestore = async (user) => {
  try {
    // first check if the user already exists in the database if not then proceed further with user creation

    const q = query(collection(db, "users"), where("userId", "==", user.id));
    const userSnap = await getDocs(q);
    if (!userSnap.empty) {
      return;
    }

    await addDoc(collection(db, "users"), {
      userId: user.id,
      method: "oauth",
      name: user.name,
      email: user.email,
      image: user.image,
      favIds: [],
      role: "basic",
    });
  } catch (error) {
    console.error("Error creating the user in firestore: ", error);
  }
};
