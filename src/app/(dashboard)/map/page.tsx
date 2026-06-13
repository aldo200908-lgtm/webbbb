"use client";

import { MapPin, Navigation, Map as MapIcon } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col h-[80vh] bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
      {/* Fake Map Background */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center grayscale"></div>
      <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-24 h-24 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl mb-6 relative">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
          <MapIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 drop-shadow-md">
          Mapa de Focos Activos
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-md mx-auto mb-8 font-medium drop-shadow-md">
          Estamos integrando la cartografía GPS en tiempo real para visualizar todos los reportes comunitarios.
        </p>

        <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30">
          <Navigation className="w-5 h-5" />
          Disponible en la próxima versión
        </div>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-white/10">
          <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Zona Crítica Actual</p>
          <p className="text-lg font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Bahía de Puno
          </p>
        </div>
      </div>
    </div>
  );
}
