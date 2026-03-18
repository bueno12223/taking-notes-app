"use client";

import { Category } from "@/types/category";
import CategoryItem from "./CategoryItem";
import SidebarUserFooter from "./SidebarUserFooter";

interface SidebarProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
  selectedCategoryId?: string | null;
  counts?: Record<string, number>;
}

export default function Sidebar({
  categories,
  onSelectCategory,
  selectedCategoryId = null,
  counts = {}
}: SidebarProps) {
  return (
    <aside className="flex flex-col w-[288px] shrink-0 h-[781px] mt-[35px] ml-[23px] hidden md:flex justify-between border-r border-black/5 pr-4 select-none">
      <div className="flex flex-col gap-1">
        <header className="flex items-center px-4 py-2">
          <span className="font-sans font-bold text-[14px] leading-[17px] text-black">
            All Categories
          </span>
        </header>

        <div className="flex flex-col">
          {categories?.map((category) => (
            <CategoryItem
              key={category.value}
              category={category}
              isSelected={selectedCategoryId === category.value}
              count={counts[category.value] || 0}
              onClick={() => onSelectCategory?.(category)}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <SidebarUserFooter />
      </div>
    </aside>
  );
}
