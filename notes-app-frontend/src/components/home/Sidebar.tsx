import CategoryItem from "./CategoryItem";

interface Category {
  name: string;
  color: string;
}

interface SidebarProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

export default function Sidebar({ categories, onSelectCategory }: SidebarProps) {
  return (
    <aside className="flex flex-col w-[288px] shrink-0 h-[781px] mt-[35px] ml-[23px] hidden md:flex">
      <div className="flex flex-col gap-0">
        <div className="flex items-center px-4 py-2">
          <span className="font-sans font-bold text-[12px] text-black">All Categories</span>
        </div>
        {categories.map((category) => (
          <CategoryItem
            key={category.name}
            name={category.name}
            color={category.color}
            onClick={() => onSelectCategory?.(category)}
          />
        ))}
      </div>
    </aside>
  );
}
