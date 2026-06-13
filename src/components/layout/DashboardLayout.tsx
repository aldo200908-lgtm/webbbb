"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { logout, signInWithGoogle } from "@/lib/firebase/authService";
import { LayoutDashboard, Award, Shield, LogOut, Loader2, ArrowLeft } from "lucide-react";
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
          <Link href="/" className="inline-block text-sm text-muted-foreground hover:text-foreground">
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
    <div className="min-h-dvh flex flex-col md:flex-row bg-muted/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full md:w-64 bg-background border-r border-zinc-200 flex flex-col p-6 gap-8 shrink-0 glass"
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
            await logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-dvh">
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
    </div>
  );
}
