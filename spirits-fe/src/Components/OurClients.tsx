import { useEffect, useState } from "react";
import Clients from "./Clients";
import { REVIEWS } from "../constants/homepage.constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const OurClients = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setCardsPerView(3);
      } else if (width >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const totalSlides = Math.max(1, Math.ceil(REVIEWS.length / cardsPerView));

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, totalSlides - 1));
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;

    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      window.clearInterval(id);
    };
  }, [totalSlides]);

  const slides = Array.from({ length: totalSlides }, (_, slideIndex) => {
    const start = slideIndex * cardsPerView;
    const end = start + cardsPerView;
    return REVIEWS.slice(start, end);
  });

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="relative lg:mt-40 mt-20 py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-[0.35] z-0"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-12 h-full">
        <header className="text-center">
          <h2 className="text-amber-500 italic text-xl mb-2">Testimonials</h2>
          <h1 className="lg:text-4xl text-3xl font-semibold text-white">
            Our Happy Clients
          </h1>
        </header>

        <div className="w-full relative max-w-[1400px] px-0 md:px-16">
          {/* Custom Navigation Left */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={totalSlides <= 1}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-colors z-20"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-full pb-16 overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slideClients, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 flex gap-6"
                >
                  {slideClients.map((client, index) => (
                    <div
                      key={`${client.name}-${index}`}
                      className="flex-1 min-w-0"
                    >
                      <Clients
                        name={client.name}
                        profileImageSrc={client.profileImageSrc}
                        review={client.review}
                        role={client.role}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-md transition-all ${index === currentSlide
                      ? "w-6 bg-amber-500"
                      : "w-2 bg-white/60"
                      }`}
                    aria-label={`Go to testimonial slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={totalSlides <= 1}
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