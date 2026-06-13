import Link from "next/link";
import { Camera, MapPin, Award, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center pt-24 pb-16 px-6">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32"
      >
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Plataforma Ciudadana Activa
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
            Reporta contaminación.<br/>
            <span className="text-brand-600">Salva el Titicaca.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-balance">
            Toma fotos de focos de contaminación, gana puntos por tus reportes verificados, y cámbialos por recompensas reales mientras ayudas a limpiar nuestro lago.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link 
              href="/report/new" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-medium rounded-full hover:scale-[0.98] transition-transform active:scale-95"
            >
              Hacer un reporte
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/rewards" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-muted text-foreground font-medium rounded-full hover:bg-zinc-200 transition-colors"
            >
              Ver recompensas
            </Link>
          </div>
        </div>
        
        {/* Visual Asset */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full aspect-square md:aspect-video lg:aspect-square bg-muted rounded-3xl overflow-hidden relative border border-zinc-200"
        >
          <img 
            src="https://images.unsplash.com/photo-1582239335474-061ff54af3a0?q=80&w=2000&auto=format&fit=crop" 
            alt="Vista del lago" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </motion.div>
      </motion.section>

      {/* How it works Bento Grid */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
          hidden: {}
        }}
        className="w-full max-w-7xl mx-auto space-y-12"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">¿Cómo funciona?</h2>
          <p className="text-muted-foreground">Tres pasos simples para hacer la diferencia.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-muted p-8 rounded-3xl flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-foreground">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Captura</h3>
              <p className="text-muted-foreground">Toma una foto clara del foco de contaminación usando la aplicación web. Asegúrate de mostrar el problema de forma evidente.</p>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-muted p-8 rounded-3xl flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-foreground">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Localiza</h3>
              <p className="text-muted-foreground">La app registrará automáticamente las coordenadas GPS para que las autoridades y ONGs sepan exactamente dónde actuar.</p>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-muted p-8 rounded-3xl flex flex-col gap-6 md:col-span-3 lg:col-span-1 lg:row-span-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center shadow-sm text-brand-600">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">3. Gana Recompensas</h3>
              <p className="text-muted-foreground">Por cada reporte verificado, acumularás puntos. Cámbialos por descuentos en tiendas locales, insignias o dona tus puntos a causas ambientales.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}
