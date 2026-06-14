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

// Helper to compress image
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 1024;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Error al comprimir la imagen"));
        }
      }, 'image/jpeg', 0.7);
    };
    img.onerror = (err) => reject(err);
  });
};

export async function submitReport(data: { file: File, description: string, lat: number | null, lng: number | null, userId: string }) {
  // 1. Create a unique path for the image
  const fileName = `reports/${data.userId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, fileName);

  // 2. Compress the image to make it ultra fast
  const compressedBlob = await compressImage(data.file);

  // 3. Upload the compressed image to Firebase Storage
  const snapshot = await uploadBytes(storageRef, compressedBlob);
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
