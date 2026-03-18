import Sidebar from "@/components/home/Sidebar";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Category } from "@/types/category";

interface AppLayoutProps {
  categories: Category[];
  children: React.ReactNode;
  onNewNote?: () => void;
  onSelectCategory?: (category: Category) => void;
}

export default function AppLayout({ categories, children, onNewNote, onSelectCategory }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-brand-linen flex flex-row">
      <Sidebar categories={categories} onSelectCategory={onSelectCategory} />
      <main className="flex flex-1 flex-col">
        {children}
      </main>
      <div className="fixed top-[39px] right-[23px] z-10">
        <Button
          label="New Note"
          onClick={onNewNote}
          icon={<Plus size={16} />}
          iconPosition="left"
        />
      </div>
    </div>
  );
}
