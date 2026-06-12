"use client";

import { useState } from "react";
import { createReport } from "@/lib/firebase/reportService";
import { Camera, MapPin, UploadCloud, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const getLocation = () => {
    setStatus("locating");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setStatus("idle");
        },
        (err) => {
          console.error(err);
          setErrorMsg("No se pudo obtener la ubicación. Por favor permite el acceso.");
          setStatus("idle");
        }
      );
    } else {
      setErrorMsg("Geolocalización no soportada en este navegador.");
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Por favor selecciona una foto.");
      return;
    }
    
    setStatus("uploading");
    try {
      await createReport(file, description, location);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Error al subir reporte: " + err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 bg-muted/50">
        <div className="bg-background max-w-md w-full p-8 rounded-3xl text-center space-y-6 shadow-sm border border-zinc-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">¡Reporte Enviado!</h2>
          <p className="text-muted-foreground">
            Gracias por ayudar a limpiar el Lago Titicaca. Tu reporte está pendiente de verificación. Una vez aprobado, recibirás puntos.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/dashboard" className="w-full inline-flex justify-center px-6 py-3 bg-foreground text-background font-medium rounded-full">
              Ir a mi panel
            </Link>
            <button onClick={() => {setStatus("idle"); setFile(null); setPreview(null); setDescription("");}} className="w-full inline-flex justify-center px-6 py-3 text-foreground font-medium rounded-full hover:bg-muted">
              Hacer otro reporte
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col max-w-2xl mx-auto p-6 pt-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">Nuevo Reporte</h1>
      <p className="text-muted-foreground mb-8">Sube una foto clara del foco de contaminación.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Photo Upload Area */}
        <div className="space-y-3">
          <label className="block font-medium">Foto de evidencia</label>
          <div className="relative w-full aspect-video md:aspect-[4/3] bg-muted rounded-2xl border-2 border-dashed border-zinc-300 overflow-hidden flex flex-col items-center justify-center hover:bg-zinc-100 transition-colors">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground p-6 text-center">
                <Camera className="w-10 h-10 mb-3 text-zinc-400" />
                <p className="font-medium text-foreground">Toca para tomar foto o elegir archivo</p>
                <p className="text-sm mt-1">Asegúrate de que haya buena iluminación</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </div>
        </div>

        {/* Location Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-medium">Ubicación</label>
            <button 
              type="button" 
              onClick={getLocation}
              className="text-sm text-brand-600 font-medium inline-flex items-center hover:underline"
              disabled={status === "locating"}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {status === "locating" ? "Localizando..." : "Obtener mi ubicación actual"}
            </button>
          </div>
          <div className="w-full p-4 bg-muted rounded-xl flex items-center text-sm text-muted-foreground">
            {location 
              ? <span className="text-foreground">✓ Ubicación registrada: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              : <span>Aún no se ha registrado la ubicación. Es recomendado para ayudar a las autoridades.</span>
            }
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="block font-medium" htmlFor="desc">Descripción (Opcional)</label>
          <textarea 
            id="desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Añade detalles sobre el tipo de residuo, tamaño del área, etc."
            className="w-full p-4 bg-muted rounded-xl border-none resize-none h-32 focus:ring-2 focus:ring-brand-500 outline-none"
          ></textarea>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button 
          type="submit" 
          disabled={status === "uploading" || !file}
          className="w-full flex items-center justify-center px-6 py-4 bg-foreground text-background font-medium rounded-full disabled:opacity-50 hover:bg-zinc-800 transition-colors"
        >
          {status === "uploading" ? (
            <span className="animate-pulse">Subiendo reporte...</span>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 mr-2" />
              Enviar reporte
            </>
          )}
        </button>

      </form>
    </main>
  );
}
