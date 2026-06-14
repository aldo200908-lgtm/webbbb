import { db, storage } from "./clientApp";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

export async function submitReport(
  data: { file: File, description: string, lat: number | null, lng: number | null, userId: string },
  onProgress?: (progress: number) => void
) {
  try {
    console.log("=== INICIANDO ENVÍO DE REPORTE ===");
    console.log("Archivo original seleccionado:", data.file.name, "Tamaño:", (data.file.size / 1024 / 1024).toFixed(2), "MB");

    // 1. Create a unique path for the image
    const fileName = `reports/${data.userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // 2. Compress the image to make it ultra fast
    console.time("compresion_imagen");
    console.log("Iniciando compresión de imagen...");
    const compressedBlob = await compressImage(data.file);
    console.timeEnd("compresion_imagen");
    console.log("Tamaño imagen comprimida:", (compressedBlob.size / 1024).toFixed(2), "KB");

    // 3. Upload the compressed image to Firebase Storage using uploadBytesResumable
    console.time("subida_storage");
    console.log("Iniciando subida a Firebase Storage (uploadBytesResumable)...");
    
    const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

    const downloadURL = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subida a Storage: ${progress.toFixed(2)}% completado.`);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Error durante uploadBytesResumable:", error);
          reject(error);
        },
        async () => {
          console.log("Subida completada exitosamente. Obteniendo DownloadURL...");
          console.timeEnd("subida_storage");
          try {
            console.time("obtener_url");
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.timeEnd("obtener_url");
            console.log("DownloadURL obtenido:", url);
            resolve(url);
          } catch (urlError) {
            console.error("Error al obtener DownloadURL:", urlError);
            reject(urlError);
          }
        }
      );
    });

    // 4. Save the report document to Firestore
    console.time("guardar_firestore");
    console.log("Guardando datos en Firestore...");
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
    console.timeEnd("guardar_firestore");
    console.log("Documento creado en Firestore con ID:", docRef.id);
    console.log("=== ENVÍO DE REPORTE COMPLETADO ===");
    
    return docRef.id;
  } catch (error) {
    console.error("=== ERROR CRÍTICO EN SUBMIT REPORT ===");
    console.error(error);
    throw error;
  }
}
