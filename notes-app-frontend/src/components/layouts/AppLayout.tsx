"use client";

import Sidebar from "@/components/home/Sidebar";
import { Category } from "@/types/category";

interface AppLayoutProps {
  categories: Category[];
  children: React.ReactNode;
  onSelectCategory?: (category: Category) => void;
  selectedCategoryId?: string | null;
  counts?: Record<string, number>;
}

export default function AppLayout({ 
  categories, 
  children, 
  onSelectCategory,
  selectedCategoryId,
  counts
}: AppLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-brand-linen flex flex-row">
      <Sidebar 
        categories={categories} 
        onSelectCategory={onSelectCategory}
        selectedCategoryId={selectedCategoryId}
        counts={counts}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
