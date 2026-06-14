"use client";

import { MapPin, Navigation, Map as MapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center"><p className="font-bold">Cargando mapa...</p></div>
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[80vh] bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
      <div className="absolute inset-0 z-0">
        <InteractiveMap />
      </div>

      {/* Floating UI Elements */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20 pointer-events-none">
        <div className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-white/10 pointer-events-auto">
          <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Zona Crítica Actual</p>
          <p className="text-lg font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Bahía de Puno
          </p>
        </div>
        
        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl pointer-events-auto">
          <p className="text-sm font-bold flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            GPS Activo
          </p>
        </div>
      </div>
    </div>
  );
}
