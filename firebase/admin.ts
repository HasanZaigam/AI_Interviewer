import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {

    if(getApps().length === 0) {
        // Check if required environment variables are present
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            console.error('Missing Firebase Admin SDK environment variables:');
            console.error('- FIREBASE_PROJECT_ID:', !!process.env.FIREBASE_PROJECT_ID);
            console.error('- FIREBASE_CLIENT_EMAIL:', !!process.env.FIREBASE_CLIENT_EMAIL);
            console.error('- FIREBASE_PRIVATE_KEY:', !!process.env.FIREBASE_PRIVATE_KEY);
            console.error('Please create a .env.local file with these variables');
            throw new Error('Firebase Admin SDK configuration is incomplete. Please check your environment variables.');
        }

        // Properly format the private key
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
            .replace(/\\n/g, '\n')
            .replace(/"/g, '')
            .trim();

        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            })
        })
    }

    return {
        auth: getAuth(),
        db: getFirestore(),
    }
}

const { auth, db } = initFirebaseAdmin();
export { auth, db };