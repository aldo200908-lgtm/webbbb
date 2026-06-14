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

// Helper to compress image and convert to Base64
const compressImageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 800; // Un poco más pequeño para Base64
      
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
      
      // Convertir directamente a texto Base64
      const base64String = canvas.toDataURL('image/jpeg', 0.6);
      resolve(base64String);
    };
    img.onerror = (err) => reject(err);
  });
};

export async function submitReport(
  data: { file: File, description: string, lat: number | null, lng: number | null, userId: string },
  onProgress?: (progress: number) => void
) {
  try {
    console.log("=== INICIANDO ENVÍO DE REPORTE (MODO BASE64) ===");
    console.log("Archivo original seleccionado:", data.file.name, "Tamaño:", (data.file.size / 1024 / 1024).toFixed(2), "MB");

    if (onProgress) onProgress(20);

    // 1. Compress the image directly to Base64 Text
    console.time("compresion_imagen_base64");
    console.log("Iniciando compresión de imagen a Base64...");
    const base64Image = await compressImageToBase64(data.file);
    console.timeEnd("compresion_imagen_base64");
    
    // Calcular peso en KB del texto (1 caracter = 1 byte aprox)
    console.log("Tamaño imagen Base64:", (base64Image.length / 1024).toFixed(2), "KB");
    
    if (onProgress) onProgress(60);

    // 2. Save the report document directly to Firestore (Saltando Storage!)
    console.time("guardar_firestore");
    console.log("Guardando datos e imagen en Firestore...");
    const reportDoc = {
      userId: data.userId,
      description: data.description,
      latitude: data.lat,
      longitude: data.lng,
      imageUrl: base64Image, // Guardamos la imagen completa como texto!
      status: 'pending', // 'pending', 'verified', 'cleaned'
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reports"), reportDoc);
    console.timeEnd("guardar_firestore");
    console.log("Documento creado en Firestore con ID:", docRef.id);
    
    if (onProgress) onProgress(100);
    console.log("=== ENVÍO DE REPORTE COMPLETADO ===");
    
    return docRef.id;
  } catch (error) {
    console.error("=== ERROR CRÍTICO EN SUBMIT REPORT ===");
    console.error(error);
    throw error;
  }
}
