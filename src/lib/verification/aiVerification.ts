import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Define the Lake Titicaca Geofence (Rough Bounding Box for Puno Bay)
// Puno city is around: Lat -15.840, Lng -70.021
const TITICACA_BOUNDS = {
  north: -15.700,
  south: -15.900,
  east: -69.800,
  west: -70.100,
};

/**
 * 1. Verificación de Ubicación (Geofencing)
 */
export function verifyLocation(lat: number, lng: number): boolean {
  if (lat <= TITICACA_BOUNDS.north && lat >= TITICACA_BOUNDS.south &&
      lng <= TITICACA_BOUNDS.east && lng >= TITICACA_BOUNDS.west) {
    return true;
  }
  return false;
}

/**
 * 2. Verificación Temporal (Menos de 5 minutos desde que se tomó)
 */
export function verifyTime(file: File): boolean {
  const now = Date.now();
  const fileTime = file.lastModified;
  // A file captured live usually has lastModified very close to now.
  // We allow up to 5 minutes of difference.
  const diffMinutes = (now - fileTime) / (1000 * 60);
  return diffMinutes <= 5;
}

/**
 * 3. Detección de Basura con TensorFlow.js
 * Requires the image to be loaded into an HTMLImageElement
 */
let model: cocoSsd.ObjectDetection | null = null;

export async function verifyGarbage(imageElement: HTMLImageElement): Promise<{ passed: boolean, labels: string[], maxConfidence: number }> {
  if (!model) {
    // tfjs automatically sets the backend
    await tf.ready();
    model = await cocoSsd.load();
  }

  const predictions = await model.detect(imageElement);
  
  // Coco-SSD classes that could be garbage in the lake:
  const garbageClasses = [
    'bottle', 'cup', 'wine glass', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 
    'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 
    'potted plant', 'bed', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 
    'scissors', 'teddy bear', 'hair drier', 'toothbrush'
  ];

  // We look for any object in the garbage classes with > 60% confidence
  const validPredictions = predictions.filter(p => garbageClasses.includes(p.class) && p.score >= 0.60);
  
  const passed = validPredictions.length > 0;
  const labels = validPredictions.map(p => p.class);
  const maxConfidence = passed ? Math.max(...validPredictions.map(p => p.score)) : 0;

  return { passed, labels, maxConfidence };
}

/**
 * 4. Generación de dHash Perceptual (Duplicados)
 * Creates a binary hash string by reducing the image to 9x8 pixels
 */
export function generateImageHash(imageElement: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(imageElement, 0, 0, 9, 8);
  const imageData = ctx.getImageData(0, 0, 9, 8).data;

  // Convert to grayscale
  const grayscales: number[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    // Standard luminosity formula
    const gray = imageData[i] * 0.299 + imageData[i + 1] * 0.587 + imageData[i + 2] * 0.114;
    grayscales.push(gray);
  }

  // Calculate dHash
  let hash = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const leftIndex = y * 9 + x;
      const rightIndex = leftIndex + 1;
      // If left pixel is brighter than right pixel, bit is 1
      hash += grayscales[leftIndex] > grayscales[rightIndex] ? '1' : '0';
    }
  }

  // Convert 64-bit binary to hex for shorter string
  let hexHash = '';
  for (let i = 0; i < hash.length; i += 4) {
    const hex = parseInt(hash.substr(i, 4), 2).toString(16);
    hexHash += hex;
  }
  
  return hexHash;
}

/**
 * Compare two hashes. Returns true if they are too similar.
 */
export function areHashesTooSimilar(hash1: string, hash2: string, threshold = 5): boolean {
  if (hash1.length !== hash2.length) return false;
  
  // Convert hex to binary
  const hexToBin = (hex: string) => parseInt(hex, 16).toString(2).padStart(4, '0');
  const bin1 = hash1.split('').map(hexToBin).join('');
  const bin2 = hash2.split('').map(hexToBin).join('');
  
  // Calculate Hamming distance
  let distance = 0;
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] !== bin2[i]) distance++;
  }
  
  // If difference is small (<= threshold), it's a duplicate
  return distance <= threshold;
}

/**
 * 5. Detección de Pantallas (Anti-spoofing Heurístico)
 * Evaluates high frequency color variation. Screens have pixels that cause unnatural banding or moiré patterns
 * when photographed.
 */
export function verifyAuthenticity(imageElement: HTMLImageElement): boolean {
  const canvas = document.createElement('canvas');
  // Scale down to reduce noise, but keep enough detail for Moiré detection
  canvas.width = 100;
  canvas.height = Math.floor(100 * (imageElement.height / imageElement.width));
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return true; // Default pass if canvas fails

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let totalContrast = 0;
  let pxCount = 0;

  // Calculate local contrast variance
  for (let y = 1; y < canvas.height - 1; y += 2) {
    for (let x = 1; x < canvas.width - 1; x += 2) {
      const idx = (y * canvas.width + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      
      const rightIdx = idx + 4;
      const bottomIdx = ((y + 1) * canvas.width + x) * 4;
      
      const rightDiff = Math.abs(r - imageData[rightIdx]) + Math.abs(g - imageData[rightIdx + 1]) + Math.abs(b - imageData[rightIdx + 2]);
      const bottomDiff = Math.abs(r - imageData[bottomIdx]) + Math.abs(g - imageData[bottomIdx + 1]) + Math.abs(b - imageData[bottomIdx + 2]);
      
      totalContrast += rightDiff + bottomDiff;
      pxCount++;
    }
  }

  const averageContrast = totalContrast / pxCount;
  
  // A photo of a screen usually has an artificially high or artificially low micro-contrast depending on focus.
  // Natural images usually fall within a certain range.
  // We will reject if it's extremely unnatural (averageContrast > 200). 
  // This is a basic heuristic and will require tuning.
  if (averageContrast > 250) {
    return false; // Rejected
  }
  
  return true;
}
