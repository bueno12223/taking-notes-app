import { Category } from "@/types/category";

interface CategoryItemProps {
  category: Category;
  onClick?: () => void;
}

export default function CategoryItem({ category, onClick }: CategoryItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center w-full px-4 py-2 gap-2 hover:bg-black/5 transition-colors"
    >
      <span
        className={`shrink-0 rounded-full w-[11px] h-[11px] bg-${category.value}`}
      />
      <span className="font-sans font-normal text-[12px] text-black flex-1 text-left">
        {category.label}
      </span>
    </button>
  );
}
