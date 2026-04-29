import { useState } from "react";
import { IoSearch, IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useGetProducts } from "../services/api/productsApi";

const Hero = () => {
  const [searchKey, setSearchkey] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchKey = useDebounce(searchKey, 300);
  const navigate = useNavigate();

  const { data: productsData, isLoading } = useGetProducts({
    name: debouncedSearchKey || undefined,
    limit: 5,
  });

  const searchResults = productsData?.data || [];
  const isDebouncing = searchKey !== debouncedSearchKey;

  function handleSearchClick() {
    if (searchKey.trim()) {
      setShowDropdown(false);
      navigate(`/products?name=${encodeURIComponent(searchKey.trim())}`);
    } else {
      navigate("/products");
    }
  }

  function handleProductClick(id: string) {
    setShowDropdown(false);
    navigate(`/products/${id}`);
  }

  return (
    <>
      <div className="overflow-hidden bg-slate-900 bg-landingBg h-screen bg-no-repeat bg-center bg-cover text-white relative z-10 brightness-50"></div>
      <div className="absolute h-full w-full flex justify-center items-center top-0 z-20">
        <div className="text-white flex flex-col 2xl:gap-4 gap-4 xl:gap-2 2xl:mb-52">
          <h1 className="line-clamp-2 w-full xl:w-[60%] 2xl:w-1/2 text-center mx-auto font-bold xl:text-3xl 2xl:text-5xl text-lg 2xl:py-2 p-0">
            Drink because you are happy, but never because you are miserable.
          </h1>
          <p className="mx-auto md:block hidden w-[40%] text-center 2xl:text-xl xl:text-lg text-gray-300">
            Drink moderately, for drunkenness neither keeps a secret, not
            observes a promise.
          </p>
          <div className="flex-col flex gap-16 justify-center items-center relative">
            <div className="flex items-center bg-gray-600/20 backdrop-blur-sm 2xl:pl-4 p-2 rounded-full lg:w-[450px] w-[370px] mx-auto border border-gray-400 mt-6 relative z-30 shadow-lg">
              <input
                type="text"
                placeholder="Search Spirits"
                value={searchKey}
                onChange={(e) => {
                  setSearchkey(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none pl-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchClick();
                }}
              />
              <button
                className="bg-orange-500 hover:bg-orange-600 transition-colors text-white rounded-full md:p-3 p-2 md:ml-2"
                onClick={handleSearchClick}
              >
                <IoSearch />
              </button>
            </div>

            {/* Dropdown */}
            {showDropdown && searchKey.trim() && (
              <div className="absolute top-[80px] w-[370px] lg:w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden z-40 text-slate-800 border border-slate-100 flex flex-col">
                {isLoading || isDebouncing ? (
                  <div className="p-4 text-center text-slate-500 flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors"
                      >
                        <img
                          src={product.thumbnail_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md bg-slate-100 border border-slate-200"
                        />
                        <div className="flex flex-col flex-1 min-w-0 text-left">
                          <span className="font-semibold text-sm truncate">
                            {product.name}
                          </span>
                          <span className="text-xs text-slate-500 truncate">
                            {product.categoryName}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-orange-600">
                          Rs. {product.minDiscountedPrice}
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={handleSearchClick}
                      className="bg-slate-50 p-3 text-center text-sm text-orange-600 font-semibold hover:bg-orange-50 cursor-pointer flex items-center justify-center gap-1 transition-colors"
                    >
                      View all results <IoArrowForward />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No products found for "{searchKey}"
                  </div>
                )}
              </div>
            )}

            {/* backdrop to close dropdown */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowDropdown(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
