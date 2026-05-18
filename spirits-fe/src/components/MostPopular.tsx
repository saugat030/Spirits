import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
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

          {!!error && !isLoading && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-xl font-medium bg-red-50 px-6 py-4 rounded-xl border border-red-100">
                {error instanceof Error ? error.message : "An error occurred fetching products."}
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
                      <Pagination
                        currentPage={products.page || 1}
                        totalPages={products.totalPages || 1}
                        isLoading={isLoading}
                        onPageChange={onPageChange}
                      />
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
