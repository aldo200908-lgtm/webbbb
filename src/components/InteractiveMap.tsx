"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Trash2, CheckCircle2 } from "lucide-react";

// Fix for default Leaflet markers in Next.js/React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const redIcon = createCustomIcon('#ef4444'); // Pending
const greenIcon = createCustomIcon('#22c55e'); // Cleaned

const PUNO_COORDINATES: [number, number] = [-15.8402, -70.0219];

const mockReports = [
  { id: 1, lat: -15.838, lng: -70.025, status: 'pending', description: 'Acumulación de basura cerca al muelle.' },
  { id: 2, lat: -15.842, lng: -70.018, status: 'cleaned', description: 'Zona limpiada por la brigada escolar.' },
  { id: 3, lat: -15.845, lng: -70.020, status: 'pending', description: 'Residuos plásticos flotando.' },
  { id: 4, lat: -15.835, lng: -70.022, status: 'cleaned', description: 'Punto de reciclaje limpio.' },
];

export default function InteractiveMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-2xl flex items-center justify-center"><p>Cargando mapa interactivo...</p></div>;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 relative z-10">
      <MapContainer 
        center={PUNO_COORDINATES} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mockReports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]} 
            icon={report.status === 'pending' ? redIcon : greenIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">
                  {report.status === 'pending' ? '🔴 Foco de Contaminación' : '🟢 Zona Limpia'}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{report.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
