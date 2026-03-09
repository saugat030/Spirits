import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FaLongArrowAltRight, FaBookmark, FaHeart, FaShare } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { GiWineBottle } from "react-icons/gi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { toast } from "react-toastify";
import { useGetProductById } from "../services/api/productsApi";
import { useState } from "react";

const ProductFullView = () => {
  const params = useParams();
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity } = useShoppingCart();
  const [selectedSize, setSelectedSize] = useState(1); // Added state for size selection

  const { data: productResponse, isLoading, error } = useGetProductById(params.id || null);
  const product = productResponse?.data;
  const quantity = params.id ? getItemQuantity(parseInt(params.id)) : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl font-medium text-gray-500">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-xl font-medium text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-xl font-medium text-gray-500">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-Poppins min-h-screen bg-white">
      <NavBar page="ProductsFullView" />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <Link to="/products" className="hover:text-yellow-600 transition-colors">Products</Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <Link to={`/products?type=${product.typeName}`} className="hover:text-yellow-600 transition-colors">
            {product.typeName}
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <section className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* LEFT SIDE - Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <figure className="w-full aspect-[4/5] lg:aspect-square bg-gray-100 rounded-3xl overflow-hidden relative group">
              {/* Optional category badge over image */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-sm z-10">
                {product.typeName}
              </div>
              <img
                src={product.imageLink}
                alt={product.name || "Product"}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </figure>
          </div>

          {/* RIGHT SIDE - Product Details */}
          <div className="lg:w-1/2 flex flex-col py-4">

            {/* Header & Actions */}
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex gap-3 text-xl text-gray-400 pt-2">
                <button className="hover:text-green-600 transition-colors"><FaBookmark /></button>
                <button className="hover:text-red-500 transition-colors"><FaHeart /></button>
                <button className="hover:text-blue-500 transition-colors"><FaShare /></button>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex text-yellow-400 text-lg">
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill className="text-gray-200" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                93% recommend this
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-4xl font-bold text-gray-900">Rs. {product.price}</span>
              <span className="text-xl font-medium text-gray-400 line-through">Rs. {product.price + 5}</span>
            </div>

            {/* Description */}
            <p className="mt-6 text-base lg:text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="w-full h-px bg-gray-200 my-8"></div>

            {/* Size Selector */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 1, size: "text-2xl", label: "Small" },
                  { id: 2, size: "text-3xl", label: "Medium" },
                  { id: 3, size: "text-4xl", label: "Large" },
                  { id: 4, size: "text-5xl", label: "Magnum" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSize(item.id)}
                    className={`flex flex-col items-center justify-center w-20 h-24 rounded-2xl border-2 transition-all duration-200 ${selectedSize === item.id
                      ? "border-yellow-500 bg-yellow-50 text-yellow-600 shadow-md"
                      : "border-gray-200 bg-white text-gray-400 hover:border-yellow-300 hover:text-yellow-500"
                      }`}
                  >
                    <GiWineBottle className={item.size} />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 my-8"></div>

            {/* Call to Actions & Cart Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex-1 min-w-[200px] bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Buy Now
              </button>

              {quantity === 0 ? (
                <button
                  onClick={() => {
                    increaseCartQuantity(parseInt(params.id as string));
                    toast.success("Added to cart");
                  }}
                  className="flex-1 min-w-[200px] bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex-1 min-w-[200px] flex items-center justify-between bg-gray-100 p-2 rounded-full border border-gray-200">
                  <button
                    onClick={() => {
                      decreaseCartQuantity(parseInt(params.id as string));
                      toast.info("Removed from cart");
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <CiCircleMinus className="text-3xl" strokeWidth={1} />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => increaseCartQuantity(parseInt(params.id as string))}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 shadow-sm transition-colors"
                  >
                    <CiCirclePlus className="text-3xl" strokeWidth={1} />
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductFullView;