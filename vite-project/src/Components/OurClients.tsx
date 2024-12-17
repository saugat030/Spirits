import { FaArrowAltCircleRight } from "react-icons/fa";
import Clients from "./Clients";
const OurClients = () => {
  return (
    <section>
      <div className="relative h-[900px] mt-56">
        <div className="absolute inset-0 bg-[url('src/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-50 z-0"></div>
        <div className="relative z-10 flex flex-col justify-between py-20 items-center gap-8 h-full">
          <div id="headings">
            <h2 className="text-white italic text-xl text-center mb-2">
              Testimonials
            </h2>
            <h1 className="text-5xl font-bold text-white">Our Happy Clients</h1>
          </div>
          <div className="flex h-[60%] w-full gap-10 justify-between container mx-auto">
            <Clients />
            <Clients />
            <Clients />
          </div>
          <FaArrowAltCircleRight className="text-red-500 text-6xl font-bold hover:scale-110" />
        </div>
      </div>
    </section>
  );
};

export default OurClients;
