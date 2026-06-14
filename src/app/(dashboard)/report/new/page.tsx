"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { submitReport, checkForDuplicateHash } from "@/lib/firebase/reportService";
import { Camera, MapPin, Upload, X, Loader2, Image as ImageIcon, Send, CheckCircle2, XCircle, Terminal } from "lucide-react";
import { verifyGarbage, verifyLocation, verifyTime, generateImageHash, verifyAuthenticity } from "@/lib/verification/aiVerification";

// Helper
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

type VerificationStep = 'idle' | 'loading' | 'success' | 'error';
interface VerificationState {
  garbage: VerificationStep;
  location: VerificationStep;
  time: VerificationStep;
  duplicate: VerificationStep;
  authenticity: VerificationStep;
}

export default function NewReportPage() {
  const { user } = useUserStore();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationState>({
    garbage: 'idle',
    location: 'idle',
    time: 'idle',
    duplicate: 'idle',
    authenticity: 'idle'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("La imagen es demasiado pesada. El límite es 10MB.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const getLocation = () => {
    setIsLocating(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        setError("No pudimos obtener tu ubicación. Por favor permite el acceso al GPS.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !location) return;

    setIsVerifying(true);
    setIsSubmitting(true);
    setVerificationError(null);
    setVerificationStatus({
      garbage: 'idle', location: 'idle', time: 'idle', duplicate: 'idle', authenticity: 'idle'
    });

    try {
      const imgElement = await loadImage(file);

      // 1. Verificación de Tiempo
      setVerificationStatus(s => ({ ...s, time: 'loading' }));
      const isTimeValid = verifyTime(file);
      if (!isTimeValid) {
        setVerificationStatus(s => ({ ...s, time: 'error' }));
        throw new Error("La foto es antigua o no fue tomada en este momento. Por favor toma una foto en vivo.");
      }
      setVerificationStatus(s => ({ ...s, time: 'success' }));

      // 2. Verificación de Autenticidad (Pantallas)
      setVerificationStatus(s => ({ ...s, authenticity: 'loading' }));
      const isAuthentic = verifyAuthenticity(imgElement);
      if (!isAuthentic) {
        setVerificationStatus(s => ({ ...s, authenticity: 'error' }));
        throw new Error("La foto parece haber sido tomada de una pantalla (fraude).");
      }
      setVerificationStatus(s => ({ ...s, authenticity: 'success' }));

      // 3. Verificación de Ubicación (Titicaca)
      setVerificationStatus(s => ({ ...s, location: 'loading' }));
      const isLocationValid = verifyLocation(location.lat, location.lng);
      if (!isLocationValid) {
        setVerificationStatus(s => ({ ...s, location: 'error' }));
        throw new Error("Estás fuera de la zona permitida (Lago Titicaca / Puno).");
      }
      setVerificationStatus(s => ({ ...s, location: 'success' }));

      // 4. Detección de Basura (TensorFlow)
      setVerificationStatus(s => ({ ...s, garbage: 'loading' }));
      const aiResult = await verifyGarbage(imgElement);
      if (!aiResult.passed) {
        setVerificationStatus(s => ({ ...s, garbage: 'error' }));
        throw new Error("La IA no detectó basura (plásticos, botellas, residuos) con confianza suficiente.");
      }
      setVerificationStatus(s => ({ ...s, garbage: 'success' }));

      // 5. Detección de Duplicados
      setVerificationStatus(s => ({ ...s, duplicate: 'loading' }));
      const imgHash = generateImageHash(imgElement);
      const isDuplicate = await checkForDuplicateHash(imgHash);
      if (isDuplicate) {
        setVerificationStatus(s => ({ ...s, duplicate: 'error' }));
        throw new Error("Esta imagen (o una muy similar) ya fue reportada anteriormente.");
      }
      setVerificationStatus(s => ({ ...s, duplicate: 'success' }));

      // === TODAS LAS VALIDACIONES PASARON ===
      setIsVerifying(false);

      await submitReport({
        file,
        description,
        lat: location.lat,
        lng: location.lng,
        userId: user.uid,
        imageHash: imgHash,
        aiLabels: aiResult.labels,
        aiConfidence: aiResult.maxConfidence
      }, (progress) => {
        setUploadProgress(progress);
      });
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setVerificationError(err.message || "Fallo en la validación local.");
      setIsSubmitting(false);
      // We keep isVerifying true so they can see the terminal results
    }
  };

  const renderStatusIcon = (status: VerificationStep) => {
    if (status === 'loading') return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700" />;
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-zinc-200 dark:border-zinc-800">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Nuevo Reporte</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Ayúdanos a identificar focos de contaminación en Puno.</p>
        </div>

        {error && !isVerifying && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {isVerifying && (
          <div className="mb-8 p-6 bg-zinc-900 text-green-400 font-mono text-sm rounded-2xl shadow-inner border border-zinc-800">
            <div className="flex items-center gap-2 text-white mb-4 border-b border-zinc-800 pb-2">
              <Terminal className="w-5 h-5" />
              <span>Terminal de IA Local</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {renderStatusIcon(verificationStatus.time)}
                <span className={verificationStatus.time === 'error' ? 'text-red-400' : ''}>[1/5] 🕒 Verificando tiempo (En vivo)...</span>
              </div>
              <div className="flex items-center gap-3">
                {renderStatusIcon(verificationStatus.authenticity)}
                <span className={verificationStatus.authenticity === 'error' ? 'text-red-400' : ''}>[2/5] 🖥️ Verificando autenticidad (Anti-pantallas)...</span>
              </div>
              <div className="flex items-center gap-3">
                {renderStatusIcon(verificationStatus.location)}
                <span className={verificationStatus.location === 'error' ? 'text-red-400' : ''}>[3/5] 📍 Verificando ubicación (Polígono Titicaca)...</span>
              </div>
              <div className="flex items-center gap-3">
                {renderStatusIcon(verificationStatus.garbage)}
                <span className={verificationStatus.garbage === 'error' ? 'text-red-400' : ''}>[4/5] 🗑️ Analizando imagen (TensorFlow.js)...</span>
              </div>
              <div className="flex items-center gap-3">
                {renderStatusIcon(verificationStatus.duplicate)}
                <span className={verificationStatus.duplicate === 'error' ? 'text-red-400' : ''}>[5/5] 🔍 Verificando duplicados (dHash)...</span>
              </div>
            </div>

            {verificationError && (
              <div className="mt-4 pt-4 border-t border-zinc-800 text-red-400 flex flex-col gap-2">
                <span className="font-bold text-red-500">❌ REPORTE RECHAZADO:</span>
                <span>{verificationError}</span>
                <button 
                  onClick={() => { setIsVerifying(false); setVerificationError(null); }}
                  className="mt-2 w-full p-2 bg-red-950 hover:bg-red-900 text-white rounded-lg transition-colors border border-red-800"
                >
                  Entendido. Volver a intentar.
                </button>
              </div>
            )}
            {!verificationError && verificationStatus.duplicate === 'success' && (
              <div className="mt-4 pt-4 border-t border-zinc-800 text-green-300 font-bold">
                ✅ Validación completada. Iniciando subida segura...
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Evidencia Fotográfica <span className="text-red-500">*</span></label>
            
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 md:h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-blue-500 transition-colors group"
              >
                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="font-medium text-zinc-600 dark:text-zinc-300">Toca para abrir cámara o galería</p>
                <p className="text-xs text-zinc-400 mt-1">Formatos soportados: JPG, PNG (Max 10MB)</p>
              </div>
            ) : (
              <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />
          </div>

          {/* Location Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Ubicación <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={getLocation}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border transition-colors ${
                  location 
                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {isLocating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : location ? (
                  <>
                    <MapPin className="w-5 h-5" />
                    Ubicación Capturada
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Obtener ubicación GPS actual
                  </>
                )}
              </button>
            </div>
            {location && (
              <p className="text-xs text-zinc-500 text-center">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
            )}
          </div>

          {/* Description Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Descripción (Opcional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué hay en el lugar? Ej: Acumulación de plásticos cerca al muelle."
              className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[120px] text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Submit Button */}
          {!isVerifying && (
            <button
              type="submit"
              disabled={isSubmitting || !file || !location}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/25"
            >
              {isSubmitting && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-800/40 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              )}
              
              <div className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadProgress > 0 && uploadProgress < 100 
                      ? `Subiendo... ${Math.round(uploadProgress)}%` 
                      : "Procesando..."}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Ejecutar Verificación IA & Enviar
                  </>
                )}
              </div>
            </button>
          )}

        </form>
      </div>
    </div>
  );
}
