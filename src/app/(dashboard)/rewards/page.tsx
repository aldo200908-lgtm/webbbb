"use client";

import { useEffect, useState } from "react";
import { Utensils, Ticket, HeartHandshake, Loader2, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/clientApp";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

export default function RewardsPage() {
  const { user, setUser } = useUserStore();
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".reward-card", {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reward-grid",
          start: "top 85%",
        },
      });
    }, []);
    return () => ctx.revert();
  }, [user]);

  if (!user) return null;
  const userPoints = user.points;

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

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (userPoints < cost) return;
    setRedeemingId(rewardId);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        points: increment(-cost)
      });
      setUser({ ...user, points: userPoints - cost });
      setSuccessMsg("¡Canje exitoso! Te contactaremos pronto para entregarte tu recompensa.");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al procesar el canje.");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="flex flex-col pb-24">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recompensas</h1>
            <p className="text-muted-foreground mt-1">Canjea tus puntos por premios o donaciones.</p>
          </div>
          <div className="px-4 py-2 bg-brand-50 border border-brand-100 rounded-full inline-flex items-center w-fit">
            <span className="text-sm font-medium">Tienes <strong className="text-brand-600 text-lg ml-1">{userPoints} pts</strong></span>
          </div>
        </div>
      </header>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">{successMsg}</p>
        </motion.div>
      )}

      <div className="reward-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map(item => {
          const canAfford = userPoints >= item.points;
          const isRedeeming = redeemingId === item.id;
          return (
            <div 
              key={item.id} 
              className="reward-card flex flex-col bg-background border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-full aspect-video bg-zinc-100 relative">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                  <div className={item.color}>{item.icon}</div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="font-semibold text-brand-600 text-lg">{item.points} pts</span>
                  <button 
                    onClick={() => handleRedeem(item.id, item.points)}
                    disabled={!canAfford || isRedeeming}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors flex items-center ${
                      canAfford 
                      ? "bg-foreground text-background hover:bg-zinc-800" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : canAfford ? "Canjear" : "Faltan puntos"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
