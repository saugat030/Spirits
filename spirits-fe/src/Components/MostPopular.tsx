import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import type { MostPopularProps } from "../types/home.types";

const MostPopular = ({
  title,
  products,
  error,
  isLoading,
  onPageChange,
}: MostPopularProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("name") || searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Track the last value we pushed to the URL so we can distinguish 
  // between internal typing and external URL changes (e.g. hitting back button)
  const lastUrlNameRef = useRef(initialSearch);

  // sync external url changes to local input
  useEffect(() => {
    const currentName = searchParams.get("name") || "";
    if (currentName !== lastUrlNameRef.current) {
      setSearchTerm(currentName);
      lastUrlNameRef.current = currentName;
    }
  }, [searchParams]);

  // sync debounced input to url
  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        
        // remove old search param to consolidate into 'name'
        if (params.has("search")) {
          params.delete("search");
        }

        const trimmedTerm = debouncedSearchTerm.trim();
        if (trimmedTerm) {
          params.set("name", trimmedTerm);
        } else {
          params.delete("name");
        }

        // Update ref so the other effect knows WE caused this URL change
        lastUrlNameRef.current = trimmedTerm;

        return params;
      },
      { replace: true }
    );
  }, [debouncedSearchTerm, setSearchParams]);

  const renderPaginationButtons = () => {
    if (!products?.page || !products?.totalPages) return null;

    const { page: currentPage, totalPages } = products;
    const buttons: (number | string)[] = [];
    const maxButtons = 7;

    if (totalPages <= 1) return null;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 4);
      }

      if (startPage > 2) buttons.push("...");

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      if (endPage < totalPages - 1) buttons.push("...");
      buttons.push(totalPages);
    }

    return (
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        <button
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border ${
            currentPage === 1 || isLoading
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
          }`}
        >
          Previous
        </button>
        {buttons.map((item, index) => (
          <button
            key={`${item}-${index}`}
            disabled={item === "..." || isLoading}
            onClick={() => typeof item === "number" && onPageChange(item)}
            className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border ${
              item === currentPage
                ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                : item === "..."
                ? "text-slate-400 border-transparent cursor-default"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border ${
            currentPage === totalPages || isLoading
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const renderPaginationInfo = () => {
    if (
      !products?.page ||
      !products?.limit ||
      !products?.total ||
      !products?.totalPages
    ) {
      return null;
    }

    const { page, limit, total, totalPages } = products;
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
      <div className="text-sm font-medium text-slate-500 mt-2">
        Showing {startItem}-{endItem} of {total} products (Page {page} of{" "}
        {totalPages})
      </div>
    );
  };

  return (
    <section className="mt-16">
      <div className="flex lg:flex-row flex-col gap-10">
        <FilterSection />
        <div className="flex flex-col gap-8 flex-1">
          <div className="px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                {title}
              </h1>
              {renderPaginationInfo()}
            </div>

            <div className="relative w-full sm:w-[320px]">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex gap-4 justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-lg font-medium text-slate-600">
                Loading products...
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-xl font-medium bg-red-50 px-6 py-4 rounded-xl border border-red-100">
                {error?.response?.data?.message || "An error occurred fetching products."}
              </h1>
            </div>
          )}

          {!isLoading && !error && products?.data && (
            <>
              <div className="flex flex-wrap gap-8 items-center justify-center lg:justify-normal px-5 min-h-[400px]">
                {products.data.length > 0 ? (
                  products.data.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))
                ) : (
                  <div className="w-full text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-sm border border-slate-100">
                      <IoSearch className="w-8 h-8 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                      No products found
                    </h2>
                    <p className="text-slate-500">
                      Try adjusting your search criteria or clearing filters.
                    </p>
                  </div>
                )}
              </div>

              {/* pagination controls */}
              {products.data.length > 0 &&
                products.totalPages &&
                products.totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 px-5 pt-8 pb-12">
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      {renderPaginationButtons()}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MostPopular;
