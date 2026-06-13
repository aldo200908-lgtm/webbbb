"use client";

import { Users, Heart, MessageSquare, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function CommunityPage() {
  const dummyPosts = [
    { id: 1, user: "María G.", action: "Limpió la bahía sur", likes: 12, comments: 3, time: "Hace 2 horas", color: "bg-brand-500" },
    { id: 2, user: "Carlos S.", action: "Reportó 3 zonas críticas", likes: 8, comments: 1, time: "Hace 5 horas", color: "bg-blue-500" },
    { id: 3, user: "Brigada Escolar", action: "Recolectó 50kg de plástico", likes: 45, comments: 12, time: "Ayer", color: "bg-purple-500" },
  ];

  return (
    <div className="flex flex-col space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Comunidad Local</h1>
        <p className="text-muted-foreground">Únete a otros guardianes del lago y coordina acciones.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {dummyPosts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-background rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${post.color} flex items-center justify-center text-white font-bold`}>
                    {post.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{post.user}</p>
                    <p className="text-xs text-muted-foreground flex items-center"><MapPin className="w-3 h-3 mr-1" /> Puno • {post.time}</p>
                  </div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground mb-4">
                {post.action} 🌊
              </p>
              <div className="flex items-center gap-4 border-t border-zinc-100 pt-4">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors">
                  <MessageSquare className="w-4 h-4" /> {post.comments}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-brand-50 rounded-3xl border border-brand-100">
            <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Ranking Semanal
            </h3>
            <p className="text-sm text-brand-700 mb-4">Conviértete en el guardián de la semana.</p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-400">#{i}</span>
                    <span className="font-medium text-sm">Usuario Anónimo</span>
                  </div>
                  <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{1000 - i * 150} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
