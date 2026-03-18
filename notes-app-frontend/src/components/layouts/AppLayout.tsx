import Sidebar from "@/components/home/Sidebar";
import NewNoteButton from "@/components/home/NewNoteButton";

interface Category {
  name: string;
  color: string;
}

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
      <NewNoteButton onClick={onNewNote} />
    </div>
  );
}
