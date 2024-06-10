// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { deleteObject, getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbeKrt5LF12YTzr-5HqYXEr6ZGPxMg7Dw",
    authDomain: "mongodb-74f50.firebaseapp.com",
    projectId: "mongodb-74f50",
    storageBucket: "mongodb-74f50.appspot.com",
    messagingSenderId: "256506964546",
    appId: "1:256506964546:web:86d1d7ab17783762995bdb",
    measurementId: "G-VF0KRB27LP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage()
const sperkyRef = ref(storage, 'image/sperky.jpg');

deleteObject(sperkyRef).then(() => {
    console.log('File deleted successfully');
    // File deleted successfully
}).catch((error) => {
    console.log('An error occurred while deleting the file:', error);
})