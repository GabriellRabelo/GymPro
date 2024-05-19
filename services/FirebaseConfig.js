import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDWCRQ0jq-wG-huK5_CAbnjZIp7RYxipTY",
    authDomain: "gympro-b7015.firebaseapp.com",
    projectId: "gympro-b7015",
    storageBucket: "gympro-b7015.appspot.com",
    messagingSenderId: "55328999809",
    appId: "1:55328999809:web:4ecc2e82432b0e61900080",
    measurementId: "G-TTLTDV0EYX"
  };
  
  export const app = initializeApp(firebaseConfig)
  export const authState = getAuth();
  export const db = getFirestore();
