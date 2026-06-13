"use client";

import { useUserStore } from "@/store/useUserStore";
import { User, Settings, Shield, Award, MapPin, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
      <header className="flex flex-col items-center text-center space-y-4 pt-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-background bg-zinc-200 dark:bg-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-zinc-500">{user.displayName.charAt(0)}</span>
            )}
          </div>
          <button className="absolute bottom-2 right-2 w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white border-4 border-background hover:scale-105 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full font-medium text-sm">
          <Shield className="w-4 h-4" />
          Guardián Cívico
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-background border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center shadow-sm">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{user.points}</p>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Puntos Acumulados</p>
        </div>
        <div className="p-6 bg-background border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Reportes Validados</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2">Ajustes Generales</h3>
        <div className="bg-background border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Editar Perfil</span>
            </div>
            <span className="text-muted-foreground">&rsaquo;</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Preferencias</span>
            </div>
            <span className="text-muted-foreground">&rsaquo;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
