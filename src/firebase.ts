
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration inlined to resolve Vercel build issues
const firebaseConfig = {
  "projectId": "ai-studio-applet-webapp-91cfd",
  "appId": "1:529839196281:web:dff1b2d3004f898854aca8",
  "apiKey": "AIzaSyDQaRVWAUzsz50CfvKm-rNdEF_IxfK5hsI",
  "authDomain": "ai-studio-applet-webapp-91cfd.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-3f3258d9-ed53-4d4c-a28d-a7a30d8493fa",
  "storageBucket": "ai-studio-applet-webapp-91cfd.firebasestorage.app",
  "messagingSenderId": "529839196281",
  "measurementId": ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Test connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
