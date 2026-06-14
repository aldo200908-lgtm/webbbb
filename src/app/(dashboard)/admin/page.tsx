"use client";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/clientApp";
import { ReportData } from "@/lib/firebase/reportService";
import { CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [reports, setReports] = useState<(ReportData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    
    async function fetchPendingReports() {
      try {
        const q = query(
          collection(db, "reports"),
          where("status", "==", "pending")
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
    fetchPendingReports();
  }, [user]);

  const handleAction = async (reportId: string, userId: string, action: "verified" | "rejected") => {
    setProcessingId(reportId);
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: action });
      
      // Si se aprueba y no es anónimo, sumar puntos al usuario
      if (action === "verified" && userId !== "anonymous") {
        const userRef = doc(db, "users", userId);
        // Otorgar 50 puntos por reporte validado
        await updateDoc(userRef, { points: increment(50) });
      }
      
      // Remover de la lista local
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      console.error(err);
      alert("Error al procesar el reporte");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col pb-12"
    >
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground mt-1">Revisa y valida los reportes ciudadanos entrantes.</p>
      </header>

      <div className="space-y-6">
        {loading ? (
          <p className="text-muted-foreground animate-pulse">Cargando reportes pendientes...</p>
        ) : reports.length === 0 ? (
          <div className="p-8 bg-muted rounded-2xl border border-zinc-100 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">¡Todo al día!</h3>
            <p className="text-muted-foreground">No hay reportes pendientes de revisión.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: idx * 0.1 } }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex flex-col bg-background rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="w-full aspect-video bg-zinc-100 relative">
                  <img src={report.imageUrl} alt="Reporte" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-semibold text-foreground flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                      {report.latitude && report.longitude ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}` : "Sin ubicación"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Usuario: {report.userId === "anonymous" ? "Anónimo" : report.userId.slice(0,6) + "..."}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-6 flex-1">
                    {report.description || <span className="italic text-muted-foreground">Sin descripción proporcionada.</span>}
                  </p>
                  
                  <div className="flex gap-3 mt-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(report.id, report.userId, "rejected")}
                      disabled={processingId === report.id}
                      className="flex-1 px-4 py-2.5 rounded-full font-medium text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Rechazar
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(report.id, report.userId, "verified")}
                      disabled={processingId === report.id}
                      className="flex-1 px-4 py-2.5 rounded-full font-medium text-sm bg-foreground text-background hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aprobar (+50 pts)"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
