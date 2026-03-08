import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Clients from "./Clients";
import { REVIEWS } from "../constants/homepage.constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const OurClients = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative lg:mt-40 mt-20 py-20 overflow-hidden">
      {/* Background Image Setup */}
      <div
        className="absolute inset-0 bg-[url('/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-[0.35] z-0"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-12 h-full container mx-auto px-4">
        <header className="text-center">
          <h2 className="text-amber-500 italic text-xl mb-2">Testimonials</h2>
          <h1 className="lg:text-4xl text-3xl font-semibold text-white">
            Our Happy Clients
          </h1>
        </header>

        {/* The Swiper Wrapper - positioned relatively to hold absolute arrows */}
        <div className="w-full max-w-7xl relative px-0 md:px-16">

          {/* Custom Navigation Left */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-colors z-20"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
              // Fixed the pagination styling syntax
              bulletClass: "swiper-pagination-bullet bg-white/60 opacity-100 transition-all",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-amber-500 !w-6 !rounded-md",
            }}
            // Added pb-16 to give room for the pagination dots at the bottom
            className="w-full pb-16"
          >
            {REVIEWS.map((client, index) => (
              // !h-auto is crucial here so all slides stretch to match the tallest one
              <SwiperSlide key={`${client.name}-${index}`} className="!h-auto">
                <Clients
                  name={client.name}
                  profileImageSrc={client.profileImageSrc}
                  review={client.review}
                  role={client.role}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Right */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-colors z-20"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurClients;