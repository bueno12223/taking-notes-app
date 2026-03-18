"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { Toaster } from "sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <CategoriesProvider>
        {children}
        {mounted && <Toaster richColors position="top-right" />}
      </CategoriesProvider>
    </AuthProvider>
  );
}
