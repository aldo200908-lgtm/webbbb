"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { logout, signInWithGoogle } from "@/lib/firebase/authService";
import { LayoutDashboard, Award, Shield, LogOut, Loader2, ArrowLeft, User, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) {
    const handleDemoLogin = () => {
      useUserStore.getState().setDemoMode(true);
      useUserStore.getState().setUser({
        uid: "demo-user-123",
        email: "demo@titicacareport.com",
        displayName: "Visitante Demo",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
        role: "user",
        points: 500,
      });
      useUserStore.getState().setLoading(false);
    };

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-muted/30 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-sm w-full bg-background p-8 rounded-3xl border border-zinc-200 text-center space-y-6 shadow-sm"
        >
          <Shield className="w-12 h-12 text-brand-600 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Inicia Sesión</h1>
            <p className="text-muted-foreground text-sm">Debes autenticarte para acceder a tu panel y gestionar tus puntos.</p>
          </div>
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-foreground text-background font-medium rounded-full hover:bg-zinc-800 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continuar con Google
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider">O prueba sin cuenta</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <button 
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-brand-50 text-brand-700 font-medium rounded-full hover:bg-brand-100 transition-colors border border-brand-200"
          >
            <User className="w-5 h-5" />
            Entrar como Demo
          </button>

          <Link href="/" className="inline-block text-sm text-muted-foreground hover:text-foreground mt-4">
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { name: "Mi Panel", href: "/dashboard", icon: LayoutDashboard },
    { name: "Recompensas", href: "/rewards", icon: Award },
    ...(user.role === "admin" ? [{ name: "Administración", href: "/admin", icon: Shield }] : [])
  ];

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-muted/30 relative">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
              {user.displayName.charAt(0)}
            </div>
          )}
          <span className="text-sm font-semibold truncate max-w-[120px]">{user.displayName}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={async () => {
              if (useUserStore.getState().isDemoMode) {
                useUserStore.getState().setDemoMode(false);
                useUserStore.getState().setUser(null);
              } else {
                await logout();
              }
              router.push("/");
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop Only) */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex w-64 bg-background border-r border-zinc-200 flex-col p-6 gap-8 shrink-0 glass"
      >
        <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Inicio
        </Link>
        
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-2xl">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
              {user.displayName.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <ThemeToggle />

        <nav className="flex-1 space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <button 
          onClick={async () => {
            if (useUserStore.getState().isDemoMode) {
              useUserStore.getState().setDemoMode(false);
              useUserStore.getState().setUser(null);
            } else {
              await logout();
            }
            router.push("/");
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-dvh pb-32 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-zinc-200/50 z-50 px-4 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        
        {/* Nav Item 1: Panel */}
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/dashboard" ? "text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium">Panel</span>
        </Link>

        {/* Nav Item 2: Comunidad / Chat */}
        <Link 
          href="/community" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/community" ? "text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium">Chat</span>
        </Link>

        {/* Floating Action Button 3: Reportar (Center) */}
        <div className="relative -top-8 flex justify-center w-16">
          <Link 
            href="/report/new" 
            className="w-16 h-16 bg-gradient-to-tr from-brand-600 to-brand-500 rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(13,148,136,0.4)] border-4 border-background hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-7 h-7" />
          </Link>
        </div>

        {/* Nav Item 4: Retirar Puntos / Premios */}
        <Link 
          href="/rewards" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/rewards" ? "text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Award className="w-6 h-6" />
          <span className="text-[10px] font-medium">Premios</span>
        </Link>

        {/* Nav Item 5: Perfil / Cuenta */}
        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/profile" ? "text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>

      </nav>

    </div>
  );
}
