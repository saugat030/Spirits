import Products from "./Products";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../types/home.types";

const MostPopular = ({
  title,
  products,
  error,
  isLoading,
  onPageChange,
}: MostPopularProps) => {
  const renderPaginationButtons = () => {
    if (!products) return null;

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
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-1.5 text-sm rounded-md border border-slate-800 ${
            currentPage === 1 || isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Previous
        </button>

        {buttons.map((item, index) => (
          <button
            key={`${item}-${index}`}
            disabled={item === "..." || isLoading}
            onClick={() => typeof item === "number" && onPageChange(item)}
            className={`px-3 py-1.5 text-sm rounded-md border border-slate-800 ${
              item === currentPage
                ? "bg-amber-600 text-white font-semibold"
                : item === "..."
                ? "text-gray-500 cursor-default"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-1.5 text-sm rounded-md border border-slate-800 ${
            currentPage === totalPages || isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const renderPaginationInfo = () => {
    if (!products) return null;

    const { page, limit, total, totalPages } = products;
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
      <div className="text-sm text-gray-600 mb-4">
        Showing {startItem}-{endItem} of {total} products (Page {page} of{" "}
        {totalPages})
      </div>
    );
  };

  return (
    <section className="mt-16">
      <div className="flex lg:flex-row flex-col gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12 flex-1">
          <div className="px-5">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {renderPaginationInfo()}
          </div>

          {isLoading && (
            <div className="flex gap-4 justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-lg text-gray-600">
                Loading products...
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-2xl">
                {error.response.data.message}
              </h1>
            </div>
          )}

          {!isLoading && !error && products?.data && (
            <>
              <div className="flex flex-wrap gap-[48px] items-center justify-center lg:justify-normal px-5 min-h-[400px]">
                {products.data.length > 0 ? (
                  products.data.map((item) => (
                    <Products
                      key={item.id}
                      imgSrc={item.image_link}
                      name={item.name || "Unknown Product"}
                      price={item.price}
                      type={item.type_name}
                      id={item.id}
                    />
                  ))
                ) : (
                  <div className="w-full text-center py-20">
                    <h2 className="text-2xl text-gray-500">
                      No products found
                    </h2>
                    <p className="text-gray-400 mt-2">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {products.data.length > 0 &&
                products.totalPages &&
                products.totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 px-5 py-8 border-t border-gray-200">
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
