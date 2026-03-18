"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
