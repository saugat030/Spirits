import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCategories } from "../services/api/categoryApi";
import { useDebounce } from "../hooks/useDebounce";

const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoryResponse } = useGetCategories();
  const categories = categoryResponse?.data || [];

  const MAX_PRICE = 20000;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || MAX_PRICE,
  ]);
  
  const debouncedPriceRange = useDebounce(priceRange, 500);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // sync external URL changes to local state
  useEffect(() => {
    setSelectedCategories(searchParams.getAll("category"));
  }, [searchParams]);

  // sync local state to URL
  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        newParams.delete("category");
        selectedCategories.forEach((category) => {
          newParams.append("category", category);
        });

        if (debouncedPriceRange[0] > 0) {
          newParams.set("minPrice", debouncedPriceRange[0].toString());
        } else {
          newParams.delete("minPrice");
        }

        if (debouncedPriceRange[1] < MAX_PRICE) {
          newParams.set("maxPrice", debouncedPriceRange[1].toString());
        } else {
          newParams.delete("maxPrice");
        }

        return newParams;
      },
      { replace: true }
    );
  }, [selectedCategories, debouncedPriceRange, setSearchParams]);


  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePriceChange = (index: number, value: number): void => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;

    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value;
    }

    setPriceRange(newRange);
  };

  const handleCategoryChange = (categoryName: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <section className="lg:w-[20%] flex flex-col gap-2 mx-5">
      <div className="flex items-center justify-between ml-2">
        <h1 className="text-xl font-semibold text-slate-900">Filters</h1>
        <button
          onClick={toggleCollapse}
          className="text-slate-500 hover:text-slate-800 transition-colors"
          aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className="h-px w-full bg-slate-200 my-2"></div>

      <div className={`${isCollapsed ? "hidden" : "flex flex-col gap-6"}`}>
        {/* Price Filter */}
        <div className="flex flex-col gap-3 px-2">
          <h2 className="text-base font-semibold text-slate-800">
            Price Range
          </h2>
          <div className="w-full">
            <div className="flex justify-between text-sm text-slate-600 mb-3 font-medium">
              <span>NPR {priceRange[0]}</span>
              <span>NPR {priceRange[1]}</span>
            </div>

            <div className="relative mb-4">
              <label className="text-xs text-slate-500 mb-1 block font-medium">
                Min Price
              </label>
              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="100"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="relative">
              <label className="text-xs text-slate-500 mb-1 block font-medium">
                Max Price
              </label>
              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="100"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>
        
        <div className="h-px w-full bg-slate-100"></div>

        {/* categories checkboxes */}
        <div className="flex flex-col gap-3 px-2">
          <h2 className="text-base font-semibold text-slate-800">Categories</h2>
          <div className="flex flex-col gap-2.5">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.category_name)}
                  onChange={() => handleCategoryChange(category.category_name)}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {category.category_name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
