"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SidebarUserFooter() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchUserAttributes()
      .then((attrs) => setEmail(attrs.email ?? null))
      .catch(() => setEmail(null));
  }, [user]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [signOut, router]);

  if (!user) return null;

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 gap-2 border-t border-black/10 mt-auto">
      <div className="flex flex-col min-w-0">
        <span className="font-sans font-normal text-[11px] text-black/40 leading-tight">
          Signed in as
        </span>
        <span className="font-sans font-medium text-[12px] text-brand-walnut truncate">
          {email ?? "..."}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        aria-label="Sign out"
        className="shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-brand-gold/20 transition-colors text-brand-gold"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
