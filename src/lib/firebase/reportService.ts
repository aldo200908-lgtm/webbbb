import { db, storage } from "./clientApp";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface ReportData {
  userId: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string;
  status: string;
  createdAt: any;
}

export async function submitReport(data: { file: File, description: string, lat: number | null, lng: number | null, userId: string }) {
  // 1. Create a unique path for the image
  const fileExtension = data.file.name.split('.').pop();
  const fileName = `reports/${data.userId}/${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  // 2. Upload the image to Firebase Storage
  const snapshot = await uploadBytes(storageRef, data.file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  // 3. Save the report document to Firestore
  const reportDoc = {
    userId: data.userId,
    description: data.description,
    latitude: data.lat,
    longitude: data.lng,
    imageUrl: downloadURL,
    status: 'pending', // 'pending', 'verified', 'cleaned'
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "reports"), reportDoc);
  return docRef.id;
}
