"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      {children}
      {mounted && <Toaster richColors position="top-right" />}
    </AuthProvider>
  );
}
