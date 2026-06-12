"use client";

import { useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/firebase/authService";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
