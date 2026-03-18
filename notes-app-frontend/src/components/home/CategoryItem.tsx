"use client";

import { Category } from "@/types/category";
import { CATEGORY_DOT_COLORS } from "@/constants";

interface CategoryItemProps {
  category: Category;
  count: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryItem({
  category,
  count,
  isSelected = false,
  onClick
}: CategoryItemProps) {
  const dotColorClass = CATEGORY_DOT_COLORS[category.value] || "bg-gray-400";

  return (
    <button
      onClick={onClick}
      className={`flex flex-row items-center w-full px-4 py-2 gap-2 transition-all duration-200 rounded-lg group cursor-pointer`}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={`shrink-0 rounded-full w-[11px] h-[11px] ${dotColorClass}`}
        />
      </div>
      <span className={`font-sans text-[12px] flex-1 text-left transition-colors ${isSelected ? "text-black font-bold" : "text-black group-hover:text-black"
        }`}>
        {category.label}
      </span>
      <span className={`font-sans text-[11px] min-w-[1.2rem] text-center`}>
        {count ?? 0}
      </span>
    </button>
  );
}
