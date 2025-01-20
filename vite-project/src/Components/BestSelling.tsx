import { useEffect, useState } from "react";
import Products from "./Products";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type productType = {
  id: number;
  name: string;
  image_link: string;
  description: string;
  quantity: number;
  type_id: number;
  type_name: string;
  price: number;
};

const BestSelling = () => {
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string>("");
  const [alc, setAlc] = useState<string>("Whiskey");

  function changeValue() {
    setAlc("Vodka");
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?type=${alc}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [alc]);

  return (
    <div className="flex flex-col w-full items-center gap-10 mt-20 h-[700px]">
      <h1 className="text-4xl font-bold">Best Selling</h1>
      <div className="flex gap-0 p-2">
        <button
          onClick={changeValue}
          className="bg-amber-600 rounded-s-2xl px-2 py-1 border border-black text-white"
        >
          Vodka
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600  px-2 py-1 border border-t-black border-b-black text-white"
        >
          Whiskey
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600   px-2 py-1 border border-t-black border-b-black text-white"
        >
          Beer
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600 px-2 py-1 border border-t-black border-b-black text-white"
        >
          Rum
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600 rounded-e-2xl px-2 py-1 border border-black text-white"
        >
          Wine
        </button>
      </div>

      {error && (
        <Products imgsrc="" name="Product Not Found" price={0} id={NaN} />
      )}

      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={2}
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
          slideShadows: true,
        }}
      >
        {products.slice(0, 5).map((item: productType) => {
          return (
            <SwiperSlide>
              <Products
                imgsrc={item.image_link}
                name={item.name}
                price={item.price}
                id={item.id}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BestSelling;
