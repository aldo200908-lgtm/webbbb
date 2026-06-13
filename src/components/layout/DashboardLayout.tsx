"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { logout, signInWithGoogle } from "@/lib/firebase/authService";
import { LayoutDashboard, Award, Shield, LogOut, Loader2, ArrowLeft, User, Camera, Users } from "lucide-react";
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

  const menuItems = [
    { label: "Mi Panel", href: "/dashboard", icon: LayoutDashboard },
    { label: "Recompensas", href: "/rewards", icon: Award },
    ...(user.role === "admin" ? [{ label: "Administración", href: "/admin", icon: Shield }] : [])
  ];

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-zinc-50 dark:bg-black relative">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs border border-zinc-200 dark:border-zinc-800">
              {user.displayName.charAt(0)}
            </div>
          )}
          <span className="text-sm font-semibold truncate max-w-[120px] text-zinc-900 dark:text-zinc-100">{user.displayName}</span>
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
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
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
        className="hidden md:flex w-64 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-r border-zinc-200/50 dark:border-zinc-800/50 flex-col p-6 gap-8 shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none"
      >
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 rounded-full border-2 border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400 flex items-center justify-center font-bold text-2xl">
                {user.displayName.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{user.displayName}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-semibold mt-2 border border-zinc-200 dark:border-zinc-800">
              <Shield className="w-3 h-3" />
              Guardián Cívico
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-md" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-dvh pb-32 md:pb-10 relative z-10">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-t border-zinc-200/50 dark:border-zinc-800/50 z-50 px-4 py-3 flex items-center justify-between pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)] dark:shadow-none">
        
        {/* Nav Item 1: Panel */}
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/dashboard" ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium tracking-wide">Panel</span>
        </Link>

        {/* Nav Item 2: Comunidad / Chat */}
        <Link 
          href="/community" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/community" ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium tracking-wide">Chat</span>
        </Link>

        {/* Floating Action Button 3: Reportar (Center) */}
        <div className="relative -top-6 flex justify-center w-16">
          <Link 
            href="/report/new" 
            className="w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-lg border-[3px] border-white dark:border-zinc-950 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-6 h-6" />
          </Link>
        </div>

        {/* Nav Item 4: Retirar Puntos / Premios */}
        <Link 
          href="/rewards" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/rewards" ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
        >
          <Award className="w-6 h-6" />
          <span className="text-[10px] font-medium tracking-wide">Premios</span>
        </Link>

        {/* Nav Item 5: Perfil / Cuenta */}
        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${pathname === "/profile" ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium tracking-wide">Perfil</span>
        </Link>

      </nav>

    </div>
  );
}
