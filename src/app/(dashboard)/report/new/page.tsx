"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { submitReport } from "@/lib/firebase/reportService";
import { Camera, MapPin, Upload, X, Loader2, Image as ImageIcon, Send } from "lucide-react";

export default function NewReportPage() {
  const { user } = useUserStore();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("La imagen es demasiado pesada. El límite es 5MB.");
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
    if (!user) {
      setError("Debes iniciar sesión para reportar.");
      return;
    }
    if (!file) {
      setError("Debes subir una foto del lugar.");
      return;
    }
    if (!location) {
      setError("Debes compartir la ubicación GPS.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReport({
        file,
        description,
        lat: location.lat,
        lng: location.lng,
        userId: user.uid
      });
      // Redirect to a success page or map
      router.push("/map");
    } catch (err: any) {
      console.error(err);
      setError("Ocurrió un error al enviar el reporte. Verifica tu conexión o intenta más tarde.");
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium border border-red-200 dark:border-red-900/50">
            {error}
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
                <p className="text-xs text-zinc-400 mt-1">Formatos soportados: JPG, PNG (Max 5MB)</p>
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
          <button
            type="submit"
            disabled={isSubmitting || !file || !location}
            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-500/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando Reporte...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Reporte
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
