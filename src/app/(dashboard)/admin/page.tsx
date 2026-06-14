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

  const handleAction = async (reportId: string, userId: string, action: "verified" | "rejected" | "fraud") => {
    setProcessingId(reportId);
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: action });
      
      // Si se rechaza o es fraude, retirar los 50 puntos provisionales que se le dieron al enviar
      if ((action === "rejected" || action === "fraud") && userId !== "anonymous") {
        const userRef = doc(db, "users", userId);
        // Retirar 50 puntos
        await updateDoc(userRef, { points: increment(-50) });
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
                  
                  <p className="text-sm text-foreground flex-1">
                    {report.description || <span className="italic text-muted-foreground">Sin descripción proporcionada.</span>}
                  </p>
                  
                  {report.aiLabels && report.aiLabels.length > 0 && (
                    <div className="mt-4 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                        🤖 Veredicto IA (Filtro)
                      </p>
                      <p className="text-sm text-blue-900 dark:text-blue-300">
                        Detectado: <span className="font-semibold">{report.aiLabels.join(", ")}</span>
                      </p>
                      {report.aiConfidence && (
                        <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                          Confianza: {Math.round(report.aiConfidence * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-auto flex-wrap">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(report.id, report.userId, "rejected")}
                      disabled={processingId === report.id}
                      className="flex-1 px-3 py-2.5 rounded-xl font-medium text-xs border border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50"
                    >
                      Rechazar (-50pts)
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(report.id, report.userId, "fraud")}
                      disabled={processingId === report.id}
                      className="flex-1 px-3 py-2.5 rounded-xl font-medium text-xs border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                      Fraude (-50pts)
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(report.id, report.userId, "verified")}
                      disabled={processingId === report.id}
                      className="w-full sm:flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aprobar Definitivo"}
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
