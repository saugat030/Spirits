import { useState } from "react";
import ProductCard from "./ProductCard";
import { useGetProducts } from "../services/api/productsApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Product } from "../types/api.types";
import ProductSkeleton from "./ProductSkeleton";
import CategoryTabs from "./CategoryTabs";
import { NoProducts } from "./NoProducts";

const CATEGORIES = ["Vodka", "Whiskey", "Beer", "Rum", "Wine"] as const;

const BestSelling = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Whiskey");

  const { data, error, isLoading, isError } = useGetProducts({
    type: activeCategory,
  });

  const productsToShow = data?.data.slice(0, 5) ?? [];
  let initialSlide: number;
  if (productsToShow.length === 3 || productsToShow.length === 4) {
    initialSlide = 1
  } else if (productsToShow.length === 5) {
    initialSlide = 2
  } else {
    // if 1 or 2 products
    initialSlide = 0
  }

  return (
    <section className="w-full flex flex-col items-center gap-8 mt-20 pb-16">
      <header className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-[#0D1B39] tracking-tight">
          Best Selling
        </h2>
        <CategoryTabs
          tabs={CATEGORIES}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />
      </header>

      {/* content */}
      <div className="w-full min-h-[380px] flex flex-col items-center justify-center">
        {isLoading && <ProductSkeleton skeletonType="loading" />}

        {isError && (
          <ProductSkeleton
            skeletonType="error"
            errorMessage={error?.message ?? "Something went wrong"}
          />
        )}
        initial slide {initialSlide}
        {!isLoading && !isError && productsToShow.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            initialSlide={initialSlide}
            loop={false}
            coverflowEffect={{
              rotate: 0,
              stretch: -30,
              depth: 200,
              modifier: 1,
            }}
            className="w-full !pb-12"
          >
            {productsToShow.map((item: Product, index) => (
              <SwiperSlide key={item.id ?? index} className="rounded-2xl">
                <ProductCard {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {!isLoading && !isError && productsToShow.length === 0 && (
          <NoProducts />
        )}
      </div>
    </section>
  );
};

export default BestSelling;
