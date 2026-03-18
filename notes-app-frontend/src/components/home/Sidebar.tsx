import { Category } from "@/types/category";
import CategoryItem from "./CategoryItem";
import SidebarUserFooter from "./SidebarUserFooter";

interface SidebarProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

export default function Sidebar({ categories, onSelectCategory }: SidebarProps) {
  return (
    <aside className="flex flex-col w-[288px] shrink-0 h-[781px] mt-[35px] ml-[23px] hidden md:flex justify-between">
      <div className="flex flex-col gap-0">
        <div className="flex items-center px-4 py-2">
          <span className="font-sans font-bold text-[12px] text-black">All Categories</span>
        </div>
        {categories?.map((category) => (
          <CategoryItem
            key={category.value}
            category={category}
            onClick={() => onSelectCategory?.(category)}
          />
        ))}
      </div>
      <SidebarUserFooter />
    </aside>
  );
}
