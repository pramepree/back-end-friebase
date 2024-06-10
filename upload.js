import express from 'express';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

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

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/uploadimages', upload.array('images', 12), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const uploadedFiles = [];
        for (const file of files) {
            const filePath = path.join(__dirname, file.path);
            const storageRef = ref(storage, `images/${file.originalname}`);
            // Upload the file
            const buffer = await fs.readFile(filePath);
            await uploadBytes(storageRef, buffer, { contentType: file.mimetype });

            // Get the public URL
            const publicUrl = await getDownloadURL(storageRef);
            uploadedFiles.push({ message: 'File uploaded successfully', url: publicUrl });
        }
        const response = {
            status: 'success',
            uploadedFiles: uploadedFiles
        };
        console.log(response.uploadedFiles.map((file) => file.url));

        const jsonArray = JSON.stringify(response.uploadedFiles.map((file) => file.url));
        console.log(jsonArray);
        res.send(uploadedFiles);


    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading files.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
