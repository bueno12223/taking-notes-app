"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/home");
    }
  }, [isLoading, user, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-brand-linen">
        <span className="text-brand-gold font-sans text-sm">Loading...</span>
      </div>
    </AuthGuard>
  );
}
