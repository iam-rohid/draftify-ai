import {
  initializeApp,
  getApp,
  getApps,
  AppOptions,
  cert,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const config: AppOptions = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replaceAll("\\n", "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  }),
};

export const firebaseAdmin = getApps().length
  ? getApp()
  : initializeApp(config);
export const authAdmin = getAuth(firebaseAdmin);
export const firestoreAdmin = getFirestore(firebaseAdmin);
