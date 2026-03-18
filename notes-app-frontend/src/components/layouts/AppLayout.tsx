import Sidebar from "@/components/home/Sidebar";
import { Category } from "@/types/category";

interface AppLayoutProps {
  categories: Category[];
  children: React.ReactNode;
  onSelectCategory?: (category: Category) => void;
}

export default function AppLayout({ categories, children, onSelectCategory }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-brand-linen flex flex-row">
      <Sidebar categories={categories} onSelectCategory={onSelectCategory} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
