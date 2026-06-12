import Link from "next/link";
import { ArrowLeft, Gift, Utensils, Ticket, HeartHandshake } from "lucide-react";

export default function RewardsPage() {
  const userPoints = 450;

  const catalog = [
    {
      id: "1",
      title: "Descuento 20% en Café del Lago",
      points: 200,
      icon: <Utensils className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "2",
      title: "Entrada Museo Totora",
      points: 300,
      icon: <Ticket className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "3",
      title: "Donar 1 Árbol a reforestación",
      points: 500,
      icon: <HeartHandshake className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <main className="min-h-dvh flex flex-col max-w-5xl mx-auto p-6 pt-12 pb-24">
      <header className="mb-12">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recompensas</h1>
            <p className="text-muted-foreground mt-1">Canjea tus puntos por premios o donaciones.</p>
          </div>
          <div className="px-4 py-2 bg-muted rounded-full inline-flex items-center w-fit">
            <span className="text-sm font-medium">Tienes <strong className="text-brand-600">{userPoints} pts</strong></span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map(item => {
          const canAfford = userPoints >= item.points;
          return (
            <div key={item.id} className="flex flex-col bg-background border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-video bg-zinc-100 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                  <div className={item.color}>{item.icon}</div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="font-semibold text-brand-600">{item.points} pts</span>
                  <button 
                    disabled={!canAfford}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
                      canAfford 
                      ? "bg-foreground text-background hover:bg-zinc-800" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Canjear" : "Faltan puntos"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  );
}
