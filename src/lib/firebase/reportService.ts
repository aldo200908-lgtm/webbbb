import { db, storage } from "./clientApp";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface ReportData {
  description: string;
  location: { lat: number; lng: number } | null;
  photoUrl: string;
  userId: string;
  status: "pending" | "verified" | "rejected";
  createdAt: any;
}

export async function createReport(
  file: File, 
  description: string, 
  location: { lat: number; lng: number } | null,
  userId: string = "anonymous"
) {
  // 1. Upload photo
  const filename = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `reports/${filename}`);
  await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);

  // 2. Save to Firestore
  const reportRef = collection(db, "reports");
  const docRef = await addDoc(reportRef, {
    description,
    location,
    photoUrl,
    userId,
    status: "pending",
    createdAt: serverTimestamp()
  });

  return docRef.id;
}
