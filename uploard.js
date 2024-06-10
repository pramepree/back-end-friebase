import express from 'express';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: firebaseConfig.storageBucket
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/uploadimage', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.join(__dirname, file.path);
        const storageRef = ref(storage, `images/${file.originalname}`);

        // Upload the file
        const buffer = await fs.readFile(filePath);
        await uploadBytes(storageRef, buffer, { contentType: file.mimetype });

        // Get the public URL
        const publicUrl = await getDownloadURL(storageRef);
        res.send({ message: 'File uploaded successfully', url: publicUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file.');
    }
});

app.get('/getallimagesURL', async (req, res) => {
    try {
      const storageRef = ref(storage, 'images/');
      const listResult = await listAll(storageRef);
      const imageUrls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return url;
        })
      );
      res.send(imageUrls);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting image URLs.');
    }
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
