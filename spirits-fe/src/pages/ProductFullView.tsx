import { Link, useParams } from "react-router-dom";
import { FaLongArrowAltRight, FaBookmark, FaHeart, FaShare } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";
import { useGetProductById } from "../services/api/productsApi";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ProductVariant, ImageType } from "../types/api.types";

const ProductFullView = () => {
  const params = useParams();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const increaseCartQuantity = useCartStore(
    (state) => state.increaseCartQuantity
  );

  const { data: productResponse, isLoading, error } = useGetProductById(
    params.id || null
  );
  const product = productResponse?.data;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    if (variant.variantImage?.url) {
      setSelectedImage(variant.variantImage);
    } else {
      setSelectedImage(null);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    increaseCartQuantity(product, selectedVariant.id);
    toast.success("Added to cart");
  };

  const handleIncreaseQuantity = () => {
    if (!selectedVariant) return;
    const maxStock = selectedVariant.inventoryQuantity;
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

    if (isLoading) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <ClipLoader color="#0D1B39" size={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-xl font-medium text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

    if (!product) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-xl font-medium text-gray-500">
            Product not found
          </div>
        </div>
      </div>
    );
  }

  const allImages = selectedImage
    ? [selectedImage, ...product.images.filter((img) => img.url !== selectedImage.url)]
    : product.images.length > 0
    ? product.images
    : [{ url: product.thumbnail_url, alt_text: product.name }];

  const mainImage = allImages[0];

  return (
    <div className="font-Poppins min-h-screen bg-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <Link
            to="/products"
            className="hover:text-amber-600 transition-colors"
          >
            Products
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <Link
            to={`/products?type=${product.categoryName}`}
            className="hover:text-amber-600 transition-colors"
          >
            {product.categoryName}
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <span className="text-gray-900 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <section className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:w-[45%] flex flex-col gap-4">
            <figure className="w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden relative">
              <img
                src={mainImage?.url || product.thumbnail_url}
                alt={mainImage?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </figure>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage?.url === img.url ||
                      (!selectedImage && index === 0)
                        ? "border-amber-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-[55%] flex flex-col py-4">
            <div className="mb-4">
              <span className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                {product.categoryName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex text-yellow-400 text-lg">
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                93% recommend this
              </span>
            </div>

            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-4xl font-bold text-gray-900">
                Rs.{" "}
                {selectedVariant
                  ? selectedVariant.discountedPrice.toLocaleString()
                  : product.minDiscountedPrice.toLocaleString()}
              </span>
              {selectedVariant &&
                selectedVariant.discountedPrice < selectedVariant.price && (
                  <span className="text-xl font-medium text-gray-400 line-through">
                    Rs. {selectedVariant.price.toLocaleString()}
                  </span>
                )}
            </div>

            <div className="w-full h-px bg-gray-200 my-8"></div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => {
                  const isOutOfStock = variant.inventoryQuantity <= 0;
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      disabled={isOutOfStock}
                      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : isOutOfStock
                          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-600"
                      }`}
                    >
                      {variant.size}
                      {isOutOfStock && (
                        <span className="block text-xs font-normal text-red-500 mt-1">
                          Out of Stock
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedVariant && (
              <div className="mt-6">
                {selectedVariant.inventoryQuantity > 0 ? (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {selectedVariant.inventoryQuantity}
                    </span>{" "}
                    available
                  </p>
                ) : (
                  <p className="text-sm text-red-500 font-semibold">
                    Out of Stock
                  </p>
                )}
              </div>
            )}

            {!selectedVariant && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 italic">
                  Please select a size to add to cart
                </p>
              </div>
            )}

            <div className="w-full h-px bg-gray-200 my-8"></div>

            {selectedVariant && selectedVariant.inventoryQuantity > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CiCircleMinus className="text-2xl" strokeWidth={1} />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={
                      quantity >= selectedVariant.inventoryQuantity
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CiCirclePlus className="text-2xl" strokeWidth={1} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant || selectedVariant.inventoryQuantity <= 0
                }
                className={`flex-1 min-w-[200px] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
                  !selectedVariant || selectedVariant.inventoryQuantity <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                Add to Cart
              </button>
              {/* purely asthetic */}
              <button className="flex-1 min-w-[200px] bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Buy Now
              </button>

              <div className="flex gap-3 text-2xl text-gray-400">
                <button className="hover:text-amber-600 transition-colors">
                  <FaBookmark />
                </button>
                <button className="hover:text-red-500 transition-colors">
                  <FaHeart />
                </button>
                <button className="hover:text-blue-500 transition-colors">
                  <FaShare />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 my-8"></div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductFullView;
