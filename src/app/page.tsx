import Link from "next/link";
import { Camera, MapPin, Award, ArrowRight } from "lucide-react";
import { StickyStack } from "@/components/StickyStack";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  const cards = [
    <div key="card-1" className="w-full max-w-4xl bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-3xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl group transition-all duration-500 hover:shadow-brand-500/20 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      <div className="flex-1 space-y-4 md:space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300">
          <Camera className="w-8 h-8 group-hover:text-brand-400 transition-colors" />
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight">1. Captura</h3>
        <p className="text-base md:text-lg text-zinc-400 max-w-md">
          Usa tu cámara para registrar focos de contaminación. Una sola foto clara es el primer paso para la limpieza del lago.
        </p>
      </div>
      <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800 relative z-10">
        <img src="https://images.unsplash.com/photo-1582239335474-061ff54af3a0?q=80&w=1200&auto=format&fit=crop" alt="Captura" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
      </div>
    </div>,
    
    <div key="card-2" className="w-full max-w-4xl bg-zinc-100 text-zinc-950 border border-zinc-200 rounded-3xl p-6 md:p-16 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 shadow-2xl group transition-all duration-500 hover:shadow-brand-500/10 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none mix-blend-multiply"></div>
      <div className="flex-1 space-y-4 md:space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
          <MapPin className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight">2. Localiza</h3>
        <p className="text-base md:text-lg text-zinc-600 max-w-md">
          Nuestra tecnología ancla las coordenadas GPS exactas. Las brigadas de limpieza sabrán exactamente dónde intervenir.
        </p>
      </div>
      <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-200 relative z-10">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Localiza" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
    </div>,

    <div key="card-3" className="w-full max-w-4xl bg-brand-600 text-white border border-brand-500 rounded-3xl p-6 md:p-16 flex flex-col items-center text-center gap-6 md:gap-8 shadow-2xl group transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
        <Award className="w-10 h-10" />
      </div>
      <div className="space-y-4 max-w-2xl relative z-10">
        <h3 className="text-4xl md:text-6xl font-bold tracking-tight">3. Recompensas</h3>
        <p className="text-lg md:text-xl text-brand-100">
          Tu acción cívica vale oro. Gana puntos por cada reporte verificado y cámbialos por entradas, descuentos o donaciones ambientales.
        </p>
      </div>
      <Link href="/report/new" className="mt-4 px-8 py-4 bg-white text-brand-600 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all shadow-lg relative z-10">
        Empezar ahora
      </Link>
    </div>
  ];

  return (
    <main className="min-h-[100dvh] flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative w-full min-h-[90vh] md:min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
          <video 
            src="https://res.cloudinary.com/dizesmfnk/video/upload/v1781320440/IMG_20260612_221311_261_osaxvz.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-105 opacity-100"
            style={{ filter: 'brightness(1.5) contrast(1.2)' }}
          />
          {/* Overlay to ensure text readability but keep video visible */}
          <div className="absolute inset-0 bg-background/20 dark:bg-background/40"></div>
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay"></div>
          {/* Subtle gradient at the bottom to transition to the next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-10 drop-shadow-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-sm font-medium tracking-wide uppercase shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span>Plataforma Ciudadana</span>
          </div>
          
          <AnimatedTitle />
          
          <p className="text-xl md:text-2xl text-foreground dark:text-zinc-100 max-w-[45ch] text-balance font-medium drop-shadow-xl">
            Reporta contaminación con una foto. Gana puntos por ayudar. Cámbialos por recompensas reales en Puno.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-4 pt-8">
            <Link 
              href="/report/new" 
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-foreground text-background font-semibold rounded-full overflow-hidden hover:scale-[0.98] transition-transform active:scale-95 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center text-lg group-hover:text-white transition-colors">
                Hacer un reporte
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/rewards" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 liquid-glass text-foreground font-semibold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Ver recompensas
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Stack Interactive Section */}
      <section className="relative w-full py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto mb-16 md:mb-24 text-center">
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">El proceso es simple.</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Tres pasos auditados para garantizar que cada reporte llegue a las autoridades correctas.</p>
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
