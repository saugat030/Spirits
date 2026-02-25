import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

type Category = "Beer" | "Vodka" | "Rum" | "Whiskey" | "Wine" | "Tequilla";

interface FilterData {
  search: string;
  priceRange: {
    min: number;
    max: number;
  };
  categories: Category[];
}

const FilterSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const categories: Category[] = [
    "Beer",
    "Vodka",
    "Rum",
    "Whiskey",
    "Wine",
    "Tequilla",
  ];

  // const handleClearFilters = (): void => {
  //   setSearchTerm("");
  //   setPriceRange([0, 1000]);
  //   setSelectedCategories([]);
  // };

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePriceChange = (index: number, value: number): void => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value;
    }

    setPriceRange(newRange);
  };

  const handleCategoryChange = (category: Category): void => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const buildFilterUrl = (): string => {
    const params = new URLSearchParams();

    // Add search term if present
    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }

    // Add categories
    selectedCategories.forEach((category) => {
      params.append("type", category);
    });

    // Add price range (only if different from default)
    if (priceRange[0] > 0) {
      params.append("minPrice", priceRange[0].toString());
    }
    if (priceRange[1] < 1000) {
      params.append("maxPrice", priceRange[1].toString());
    }

    return `/products?${params.toString()}`;
  };

  const handleFilter = (): void => {
    const filterData: FilterData = {
      search: searchTerm,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1],
      },
      categories: selectedCategories,
    };

    console.log("Filter Values:", filterData);

    // Navigate to the filtered products page
    const filterUrl = buildFilterUrl();
    console.log("Navigating to:", filterUrl);
    navigate(filterUrl);
  };

  return (
    <section className="lg:w-[20%]  flex flex-col gap-2 mx-5">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between ml-2">
        <h1 className="lg:text-3xl text-xl font-medium">Filters</h1>
        <button
          onClick={toggleCollapse}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="brown"
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
      <hr className="bg-black" />

      {/* Collapsible filter content */}
      <div className={`${isCollapsed ? "hidden" : "flex flex-col gap-2"}`}>
        {/* Search Filter */}
        <div className="my-4 bg-white rounded-2xl">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Search</h3>

            <div className="relative max-w-md">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <hr />

        {/* Price Filter */}
        <div id="Price_Section" className="flex flex-col gap-3 ml-2 mb-2">
          <h2 className="text-lg font-medium text-gray-900 self-start">
            Price Range
          </h2>
          <div className="w-full px-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Rs. {priceRange[0]}</span>
              <span>Rs. {priceRange[1]}</span>
            </div>

            {/* Min Price Slider */}
            <div className="relative mb-3">
              <label className="text-xs text-gray-500 mb-1 block">
                Min Price
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[0]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePriceChange(0, parseInt(e.target.value))
                }
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb-amber-600"
              />
            </div>

            {/* Max Price Slider */}
            <div className="relative">
              <label className="text-xs text-gray-500 mb-1 block">
                Max Price
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePriceChange(1, parseInt(e.target.value))
                }
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer slider-thumb-amber"
              />
            </div>
          </div>
        </div>
        <hr />

        {/* Categories Filter */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-gray-900 my-2">Categories</h1>
          <div className="grid grid-cols-2 gap-1 ml-2">
            {categories.map((category) => (
              <label key={category} htmlFor={category}>
                <input
                  type="checkbox"
                  id={category}
                  name={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="me-1"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFilter}
          className="bg-amber-600 text-white border border-gray-600 rounded-lg px-4 py-1 self-start mt-2"
        >
          Filter
        </button>
      </div>
    </section>
  );
};

export default FilterSection;
