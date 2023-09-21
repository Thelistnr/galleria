import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyApsn5_Dn3dWEdtnkuG4pxW9XlhitR8q5w",
  authDomain: "gallery-30f46.firebaseapp.com",
  projectId: "gallery-30f46",
  storageBucket: "gallery-30f46.appspot.com",
  messagingSenderId: "193716625679",
  appId: "1:193716625679:web:f0212e2fe588f954ae9e7a",
  measurementId: "G-3RPL15GR4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app)