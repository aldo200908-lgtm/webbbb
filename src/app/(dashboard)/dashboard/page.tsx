"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, MapPin, CheckCircle2, Clock, Camera, Gift, Users, ArrowRight } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/clientApp";
import { ReportData } from "@/lib/firebase/reportService";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [reports, setReports] = useState<(ReportData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".report-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".report-card",
          start: "top 90%",
        },
      });
    }, []);
    return () => ctx.revert();
  }, [user]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {/* Nuevo Reporte Card */}
        <Link href="/report/new" className="group p-6 bg-brand-600 text-white rounded-3xl border border-brand-500 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-brand-500/30 relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/20">
            <Camera className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-1">Nuevo Reporte</h3>
            <p className="text-brand-100 text-sm flex items-center font-medium">
              Abrir cámara <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
            </p>
          </div>
        </Link>
        
        {/* Recompensas Card */}
        <Link href="/rewards" className="group p-6 liquid-glass-dark text-white rounded-3xl hover:-translate-y-2 transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-yellow-500/30 transition-colors duration-700"></div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/10">
            <Gift className="w-7 h-7 text-yellow-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-1">Recompensas</h3>
            <p className="text-zinc-400 text-sm flex items-center font-medium">
              Catálogo de premios <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
            </p>
          </div>
        </Link>

        {/* Ver Mapa Card */}
        <Link href="/map" className="group p-6 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 relative z-10 border border-blue-200 dark:border-blue-800">
            <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-1">Ver Mapa</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center font-medium">
              Explorar focos <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
            </p>
          </div>
        </Link>

        {/* Comunidad Card */}
        <Link href="/community" className="group p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-purple-500/30 relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-1">Comunidad</h3>
            <p className="text-indigo-100 text-sm flex items-center font-medium">
              Ver ciudadanos <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
            </p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-bold">Mis Reportes Anteriores</h2>
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
                <div key={report.id} className="report-card flex gap-4 p-4 bg-background rounded-2xl border border-zinc-200 hover:shadow-sm transition-shadow">
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
