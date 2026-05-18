type CategoryTabsProps = {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const CategoryTabs = ({ tabs, activeTab, onTabChange }: CategoryTabsProps) => {
  return (
    <div
      className="flex w-full rounded-full bg-amber-100/30 p-1 shadow-inner gap-0.5"
      role="tablist"
      aria-label="Product category"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
          className={`
            relative z-10 flex-1 rounded-full py-2.5 px-4 text-sm font-medium
            transition-all duration-200
            ${activeTab === tab
              ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
              : " text-gray-500 hover:underline"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
