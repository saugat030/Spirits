import { Link, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import { GiWineBottle } from "react-icons/gi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { toast } from "react-toastify";
import { useGetProductById } from "../services/api/productsApi";

const ProductFullView = () => {
  const params = useParams();
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity } =
    useShoppingCart();

  // Use the hook to fetch product data
  const {
    data: productResponse,
    isLoading,
    error,
  } = useGetProductById(params.id || null);

  // Extract product data from the API response
  const product = productResponse?.data;

  // Check if params.id has a value if no parameters are received then it throws an error since by default params.id will be undefined.
  const quantity = params.id ? getItemQuantity(parseInt(params.id)) : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="font-Poppins overflow-hidden">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl font-semibold">Loading product...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="font-Poppins overflow-hidden">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl font-semibold text-red-500">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="font-Poppins overflow-hidden">
        <NavBar page="ProductsFullView" />
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl font-semibold">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-Poppins overflow-hidden">
      <NavBar page="ProductsFullView" />
      <section className="flex lg:flex-row flex-col gap-10 lg:gap-0 mt-20">
        <div
          id="LEFT_SIDE"
          className="flex-1 flex flex-col h-full justify-center items-center p-2"
        >
          <figure className="h-[500px] rounded-xl">
            <img
              src={product.image_link}
              alt={product.name || "Product"}
              className="h-full w-full rounded-xl object-cover"
            />
          </figure>
        </div>
        {/* RIGHT SIDE */}
        <div id="RIGHT_SIDE" className="flex-1 flex-col flex px-2">
          <p className="2xl:text-lg text-base flex items-center font-semibold gap-3 p-1">
            <Link to="/">Home</Link>
            <FaLongArrowAltRight className="text-yellow-500" />
            <Link to="/products">Products</Link>
            <FaLongArrowAltRight className="text-yellow-500" />
            <a href={`/products?type=${product.type_name}`}>
              {product.type_name}
            </a>
            <FaLongArrowAltRight className="text-yellow-500" />
            <a href="">{product.name}</a>
          </p>
          <div className="py-6">
            <div className="flex justify-between py-2">
              <h1 className="2xl:text-5xl text-4xl font-bold">
                {product.name}
              </h1>
              <div className="flex gap-4 text-2xl p-1">
                <FaBookmark className="text-green-600" />
                <FaHeart className="text-red-500" />
                <FaShare className="text-blue-300" />
              </div>
            </div>
            <p className="2xl:text-xl text-lg">{product.description}</p>
          </div>
          <hr />
          <div className="2xl:py-8 lg:py-6 py-4 grid grid-cols-2 w-full place-content-evenly">
            <h1 className="2xl:text-5xl text-4xl font-bold text-yellow-500 ">
              Rs. {product.price}
            </h1>
            <h2 className="text-2xl text-yellow-400 flex gap-1">
              <PiStarFill />
              <PiStarFill />
              <PiStarFill />
              <PiStarFill />
              <PiStarFill className="text-gray-300" />
            </h2>
            <h3 className="text-gray-500 2xl:text-4xl text-3xl line-through">
              ${product.price + 5}
            </h3>
            <h2 className="text-green-600 2xl:text-lg text-sm">
              93% of buyers have recommended this.
            </h2>
          </div>
          <hr />
          <div className="flex flex-col 2xl:gap-4 gap-0 2xl:py-8 lg:py-6 py-4">
            <h3 className="lg:text-2xl text-xl font-medium text-gray-500">
              Choose a size
            </h3>
            <div className="flex justify-start lg:gap-10 gap-4 2xl:py-6 lg:py-4 py-2">
              <div className="rounded-full font-semibold w-16 lg:w-20 aspect-square flex justify-center items-center bg-red-200 border border-red-400 hover:scale-105">
                <GiWineBottle className="text-2xl" />
              </div>
              <div className="rounded-full font-semibold w-16 lg:w-20 aspect-square flex justify-center items-center bg-pink-200 border border-pink-400 hover:scale-105">
                <GiWineBottle className="text-4xl" />
              </div>
              <div className="rounded-full font-semibold w-16 lg:w-20  aspect-square flex justify-center items-center bg-purple-200 border border-purple-400 hover:scale-105">
                <GiWineBottle className="text-5xl" />
              </div>
              <div className="rounded-full font-semibold w-16 lg:w-20  aspect-square flex justify-center items-center bg-green-200 border border-green-400 hover:scale-105">
                <GiWineBottle className="text-6xl" />
              </div>
            </div>
          </div>
          <hr />
          <div className="2xl:py-8 py-6 flex flex-col lg:flex-row gap-8 items-center">
            <div className="gap-4 lg:gap-8 flex">
              <button className="bg-green-600 border border-green-800 transform hover:-translate-y-1 hover:shadow-lg shadow-green-700 2xl:px-8 2xl:py-4 px-6 py-2  rounded-2xl text-white font-semibold text-xl 2xl:text-2xl">
                Buy Now
              </button>
              <button
                onClick={() => {
                  increaseCartQuantity(parseInt(params.id as string));
                  toast.success("Added to cart");
                }}
                className="bg-yellow-500 border border-yellow-700 2xl:px-8 2xl:py-4 px-6 py-2 transform hover:-translate-y-1 hover:shadow-lg shadow-yellow-700 rounded-2xl text-white font-semibold text-xl 2xl:text-2xl"
              >
                Add to Cart
              </button>
            </div>
            {quantity > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    increaseCartQuantity(parseInt(params.id as string));
                  }}
                  className="hover:text-white hover:bg-green-900 rounded-full"
                >
                  <CiCirclePlus className="text-4xl" strokeWidth={1} />
                </button>
                <span className="text-2xl font-semibold mx-2">
                  {quantity != 0 && quantity}
                </span>
                <button
                  onClick={() => {
                    decreaseCartQuantity(parseInt(params.id as string));
                    toast.info("Removed from cart");
                  }}
                  className="hover:text-white hover:bg-red-800 rounded-full"
                >
                  <CiCircleMinus className="text-4xl" strokeWidth={1} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductFullView;
