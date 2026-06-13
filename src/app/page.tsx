import Link from "next/link";
import { Camera, MapPin, Award, ArrowRight } from "lucide-react";
import { StickyStack } from "@/components/StickyStack";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  const cards = [
    <div key="card-1" className="w-full max-w-5xl liquid-glass-dark text-zinc-50 rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row items-stretch gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-all duration-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-400/30 transition-colors duration-700"></div>
      
      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-between space-y-8 relative z-10">
        <div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner group-hover:scale-110 group-hover:bg-brand-500/20 group-hover:border-brand-500/30 transition-all duration-500 mb-8">
            <Camera className="w-7 h-7 group-hover:text-brand-400 transition-colors" />
          </div>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-4">1. Captura</h3>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md font-medium">
            Usa tu cámara para registrar focos de contaminación. Una sola foto clara es el primer paso para la limpieza del lago.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> App Activa
          </div>
        </div>
      </div>

      {/* Bento Media */}
      <div className="flex-1 w-full md:w-auto rounded-3xl overflow-hidden bg-black/40 border border-white/10 relative z-10 group-hover:border-brand-500/30 transition-colors duration-500 shadow-inner">
        <img src="https://images.unsplash.com/photo-1582239335474-061ff54af3a0?q=80&w=1200&auto=format&fit=crop" alt="Captura" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-out" />
        {/* UI Overlay Element */}
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Análisis IA</p>
              <p className="text-xs text-zinc-400">Detectando residuos...</p>
            </div>
          </div>
          <span className="text-green-400 font-mono text-sm">98%</span>
        </div>
      </div>
    </div>,
    
    <div key="card-2" className="w-full max-w-5xl liquid-glass-dark text-zinc-50 rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row-reverse items-stretch gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-all duration-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-400/30 transition-colors duration-700"></div>
      
      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-between space-y-8 relative z-10 pl-0 md:pl-8">
        <div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500 mb-8">
            <MapPin className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-4">2. Localiza</h3>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md font-medium">
            Nuestra tecnología ancla las coordenadas GPS exactas. Las brigadas de limpieza sabrán exactamente dónde intervenir.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Precisión</p>
            <p className="text-lg font-bold text-white font-mono">±3 Metros</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Cobertura</p>
            <p className="text-lg font-bold text-white font-mono">100% Puno</p>
          </div>
        </div>
      </div>

      {/* Bento Media */}
      <div className="flex-1 w-full md:w-auto rounded-3xl overflow-hidden bg-black/40 border border-white/10 relative z-10 group-hover:border-blue-500/30 transition-colors duration-500 shadow-inner">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Localiza" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0" />
        
        {/* Floating Map Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
          <div className="w-12 h-12 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] flex items-center justify-center animate-bounce">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-2 bg-black/40 rounded-full blur-sm mt-2"></div>
        </div>
      </div>
    </div>,

    <div key="card-3" className="w-full max-w-5xl bg-gradient-to-br from-brand-600 to-brand-900 text-white rounded-[2.5rem] p-6 md:p-16 flex flex-col items-center text-center gap-8 md:gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-all duration-700 relative overflow-hidden border border-brand-400/30">
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.5),transparent_50%)] pointer-events-none"></div>

      <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 relative z-10 group-hover:rotate-12">
        <Award className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-6 max-w-3xl relative z-10">
        <h3 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">3. Recompensas</h3>
        <p className="text-xl md:text-2xl text-brand-50 font-medium leading-relaxed drop-shadow-md">
          Tu acción cívica vale oro. Gana puntos por cada reporte verificado y cámbialos por entradas, descuentos o donaciones ambientales.
        </p>
      </div>

      {/* Floating Badges */}
      <div className="flex flex-wrap justify-center gap-4 relative z-10 w-full max-w-2xl mt-4">
        <div className="flex-1 min-w-[150px] p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center group-hover:-translate-y-2 transition-transform duration-500 delay-100 hover:bg-black/30">
          <span className="text-3xl font-bold text-white mb-1">+50</span>
          <span className="text-xs text-brand-200 uppercase tracking-wider">Puntos / Reporte</span>
        </div>
        <div className="flex-1 min-w-[150px] p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center group-hover:-translate-y-2 transition-transform duration-500 delay-200 hover:bg-black/30">
          <span className="text-3xl font-bold text-white mb-1">Nivel</span>
          <span className="text-xs text-brand-200 uppercase tracking-wider">Guardián Cívico</span>
        </div>
        <div className="flex-1 min-w-[150px] p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center group-hover:-translate-y-2 transition-transform duration-500 delay-300 hover:bg-black/30">
          <span className="text-3xl font-bold text-white mb-1">Top %</span>
          <span className="text-xs text-brand-200 uppercase tracking-wider">Ranking Local</span>
        </div>
      </div>
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
