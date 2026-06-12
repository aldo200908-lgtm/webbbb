"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, MapPin, CheckCircle2, Clock } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/clientApp";
import { ReportData } from "@/lib/firebase/reportService";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [reports, setReports] = useState<(ReportData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    async function fetchReports() {
      try {
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user!.uid)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as (ReportData & { id: string })[];
        
        fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setReports(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hola, {user.displayName}</h1>
          <p className="text-muted-foreground mt-1">Revisa tus aportes y recompensas.</p>
        </div>
        
        <div className="bg-brand-50 border border-brand-100 p-6 rounded-3xl flex items-center gap-6 min-w-[280px]">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-600/80 mb-1">Puntos disponibles</p>
            <p className="text-3xl font-bold text-brand-900">{user.points}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Mis Reportes</h2>
            <Link href="/report/new" className="text-sm font-medium text-brand-600 hover:underline">
              + Nuevo reporte
            </Link>
          </div>
          
          <div className="grid gap-4">
            {loading ? (
              <p className="text-muted-foreground animate-pulse">Cargando reportes...</p>
            ) : reports.length === 0 ? (
              <div className="p-8 bg-muted rounded-2xl border border-zinc-100 text-center">
                <p className="text-muted-foreground">Aún no has hecho ningún reporte.</p>
                <Link href="/report/new" className="inline-block mt-4 text-brand-600 font-medium hover:underline">Comenzar ahora</Link>
              </div>
            ) : (
              reports.map(report => (
                <div key={report.id} className="flex gap-4 p-4 bg-background rounded-2xl border border-zinc-200 hover:shadow-sm transition-shadow">
                  <div className="w-24 h-24 rounded-xl bg-zinc-200 overflow-hidden flex-shrink-0 relative">
                    <img src={report.photoUrl} alt="Reporte" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                          {report.location ? `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}` : "Ubicación desconocida"}
                        </p>
                        {report.status === "verified" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificado
                          </span>
                        ) : report.status === "rejected" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                            Rechazado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.description || "Sin descripción"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
