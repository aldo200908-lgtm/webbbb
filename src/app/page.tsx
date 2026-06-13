import Link from "next/link";
import { Camera, MapPin, Award, ArrowRight } from "lucide-react";
import { StickyStack } from "@/components/StickyStack";

export default function Home() {
  const cards = [
    <div key="card-1" className="w-full max-w-4xl bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
      <div className="flex-1 space-y-6">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight">1. Captura</h3>
        <p className="text-lg text-zinc-400 max-w-md">
          Usa tu cámara para registrar focos de contaminación. Una sola foto clara es el primer paso para la limpieza del lago.
        </p>
      </div>
      <div className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800">
        <img src="https://images.unsplash.com/photo-1582239335474-061ff54af3a0?q=80&w=1200&auto=format&fit=crop" alt="Captura" className="w-full h-full object-cover opacity-80" />
      </div>
    </div>,
    
    <div key="card-2" className="w-full max-w-4xl bg-zinc-100 text-zinc-950 border border-zinc-200 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row-reverse items-center gap-12 shadow-2xl">
      <div className="flex-1 space-y-6">
        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight">2. Localiza</h3>
        <p className="text-lg text-zinc-600 max-w-md">
          Nuestra tecnología ancla las coordenadas GPS exactas. Las brigadas de limpieza sabrán exactamente dónde intervenir.
        </p>
      </div>
      <div className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-200">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Localiza" className="w-full h-full object-cover" />
      </div>
    </div>,

    <div key="card-3" className="w-full max-w-4xl bg-brand-600 text-white border border-brand-500 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center gap-8 shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
        <Award className="w-10 h-10" />
      </div>
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-4xl md:text-6xl font-bold tracking-tight">3. Recompensas</h3>
        <p className="text-xl text-brand-100">
          Tu acción cívica vale oro. Gana puntos por cada reporte verificado y cámbialos por entradas, descuentos o donaciones ambientales.
        </p>
      </div>
      <Link href="/report/new" className="mt-4 px-8 py-4 bg-white text-brand-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">
        Empezar ahora
      </Link>
    </div>
  ];

  return (
    <main className="min-h-[100dvh] flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative w-full min-h-[90vh] md:min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2400&auto=format&fit=crop" 
            alt="Lago Titicaca" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          {/* Overlay to ensure text readability (works on light and dark mode) */}
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-[2px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-sm font-medium tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span>Plataforma Ciudadana</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[1.05] text-balance text-foreground">
            El lago te necesita. <br />
            <span className="text-brand-600">Actúa hoy.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[45ch] text-balance font-light">
            Reporta contaminación con una foto. Gana puntos por ayudar. Cámbialos por recompensas reales en Puno.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
            <Link 
              href="/report/new" 
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-foreground text-background font-semibold rounded-full overflow-hidden hover:scale-[0.98] transition-transform active:scale-95 shadow-xl"
            >
              <span className="relative z-10 flex items-center text-lg">
                Hacer un reporte
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/rewards" 
              className="inline-flex items-center justify-center px-10 py-5 liquid-glass text-foreground font-semibold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Ver recompensas
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Stack Interactive Section */}
      <section className="relative w-full py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">El proceso es simple.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Tres pasos auditados para garantizar que cada reporte llegue a las autoridades correctas.</p>
        </div>
        
        <StickyStack cards={cards} />
      </section>

      {/* Trust & Footer Strip */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground text-sm">
          <p>© 2026 Titicaca Report App. Proyecto cívico para Puno.</p>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Mi Panel</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Moderación</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
