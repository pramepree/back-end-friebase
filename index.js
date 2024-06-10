// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getDonloadURL, getStorage, ref } from "firebase/storage";
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
const analytics = getAnalytics(app);
const storageRef = ref(storage);

async function downloadImage(sparkyRef) {
    try {
        const url = await getDownloadURL(sparkyRef);
        // 'url' is the download URL for 'images/sparky.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            const blob = xhr.response;
            // Do something with the blob
        };
        xhr.open('GET', url);
        xhr.send();

        // Or insert into an <img> element
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
    } catch (error) {
        // Handle any errors
        console.error(error);
    }
}