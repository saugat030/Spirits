import { useState } from "react";
import Products from "./Products";
import { useGetProducts } from "../services/api/productsApi";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ProductData } from "../types/api.types";

const BestSelling = () => {
  const [type, setType] = useState<string>("Whiskey");

  const { data, error, isLoading, isError } = useGetProducts({ type });

  const products = data?.data || [];

  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  return (
    <div className="flex flex-col w-full items-center gap-10 mt-20 h-[700px]">
      <h1 className="text-4xl font-bold">Best Selling</h1>

      <div className="flex gap-0 p-2">
        <button
          onClick={() => handleTypeChange("Vodka")}
          className={`rounded-s-2xl px-2 py-1 border border-black text-white transition-all duration-200 ${
            type === "Vodka"
              ? "bg-amber-800 shadow-inner shadow-amber-800 scale-105 font-semibold"
              : "bg-amber-600 shadow-inner shadow-amber-600 hover:shadow-xl hover:bg-amber-700"
          }`}
        >
          Vodka
        </button>
        <button
          onClick={() => handleTypeChange("Whiskey")}
          className={`px-2 py-1 border border-t-black border-b-black text-white transition-all duration-200 ${
            type === "Whiskey"
              ? "bg-amber-800 shadow-inner shadow-amber-800 scale-105 font-semibold"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          Whiskey
        </button>
        <button
          onClick={() => handleTypeChange("Beer")}
          className={`px-2 py-1 border border-t-black border-b-black text-white transition-all duration-200 ${
            type === "Beer"
              ? "bg-amber-800 shadow-inner shadow-amber-800 scale-105 font-semibold"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          Beer
        </button>
        <button
          onClick={() => handleTypeChange("Rum")}
          className={`px-2 py-1 border border-t-black border-b-black text-white transition-all duration-200 ${
            type === "Rum"
              ? "bg-amber-800 shadow-inner shadow-amber-800 scale-105 font-semibold"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          Rum
        </button>
        <button
          onClick={() => handleTypeChange("Wine")}
          className={`rounded-e-2xl px-2 py-1 border border-black text-white transition-all duration-200 ${
            type === "Wine"
              ? "bg-amber-800 shadow-inner shadow-amber-800 scale-105 font-semibold"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          Wine
        </button>
      </div>

      {isLoading && (
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      )}

      {isError && (
        <Products
          type="Drink"
          imgSrc=""
          name={error?.message || "Cannot connect to the server"}
          price={0}
          id={NaN}
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          initialSlide={2}
          //set the initial slide at index-2
          loop={false}
          coverflowEffect={{
            rotate: 0,
            //rotates the sliders by 0 degress
            stretch: -30,
            //Controls the spacing between the slides. The more you put the more squished it gets for some reason.
            depth: 200,
            //As the name suggests control the 3d like effect. Basically kati deep push garne slides lai vanne control ho.
            modifier: 1,
            //Multiplies the effects by this number. Depth 200 xa vaney modifier 2 garda 200*2 hunxa (same thing with rotate)
          }}
        >
          {products.slice(0, 5).map((item: ProductData, index) => {
            return (
              <SwiperSlide key={item.id || index} className="rounded-2xl">
                <Products
                  type={item.type_name}
                  imgSrc={item.image_link}
                  name={item.name}
                  price={item.price}
                  id={item.id}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center">
          <p>No products found for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default BestSelling;
