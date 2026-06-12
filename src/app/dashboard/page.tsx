import Link from "next/link";
import { ArrowLeft, Award, Image as ImageIcon, MapPin, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  // Mock data for the prototype
  const points = 450;
  
  const reports = [
    {
      id: "1",
      date: "Hace 2 días",
      status: "verified",
      location: "Playa Chucuito",
      pointsEarned: 150,
      image: "https://images.unsplash.com/photo-1621451537084-482c73073e0f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "2",
      date: "Hace 1 semana",
      status: "pending",
      location: "Malecón Bahía",
      pointsEarned: 0,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <main className="min-h-dvh flex flex-col max-w-5xl mx-auto p-6 pt-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Mi Panel</h1>
          <p className="text-muted-foreground mt-1">Revisa tus aportes y recompensas.</p>
        </div>
        
        {/* Points Card */}
        <div className="bg-brand-50 border border-brand-100 p-6 rounded-3xl flex items-center gap-6 min-w-[280px]">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-600/80 mb-1">Puntos disponibles</p>
            <p className="text-3xl font-bold text-brand-900">{points}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Reports Feed */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Mis Reportes</h2>
            <Link href="/report/new" className="text-sm font-medium text-brand-600 hover:underline">
              + Nuevo reporte
            </Link>
          </div>
          
          <div className="grid gap-4">
            {reports.map(report => (
              <div key={report.id} className="flex gap-4 p-4 bg-muted rounded-2xl border border-zinc-100">
                <div className="w-24 h-24 rounded-xl bg-zinc-200 overflow-hidden flex-shrink-0 relative">
                  <img src={report.image} alt="Reporte" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                        {report.location}
                      </p>
                      {report.status === "verified" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{report.date}</p>
                  </div>
                  {report.pointsEarned > 0 && (
                    <p className="text-sm font-medium text-brand-600">+{report.pointsEarned} pts</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full md:w-80 space-y-4">
          <div className="bg-foreground text-background p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-2">Canjea tus puntos</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Tienes suficientes puntos para reclamar recompensas en comercios locales asociados.
            </p>
            <Link href="/rewards" className="w-full inline-flex justify-center px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors">
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
