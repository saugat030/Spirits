import { FaArrowAltCircleRight } from "react-icons/fa";
import Clients from "./Clients";
import { REVIEWS } from "../constants/homepage.constants";
const OurClients = () => {
  return (
    // This section is being overlapped tesaile esma inspect handa margin dekhindaina
    <section className="relative lg:mt-40 mt-20 p-4 lg:p-0">
      <div className="absolute inset-0 bg-[url('src/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-[0.35] z-0"></div>
      <div className="relative z-10 flex flex-col justify-between py-20 items-center gap-8 h-full">
        <div id="headings">
          <h2 className="text-white italic text-xl text-center mb-2">
            Testimonials
          </h2>
          <h1 className="lg:text-6xl text-4xl font-semibold text-white">
            Our Happy Clients
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-10 lg:justify-between justify-center container mx-auto">
          {REVIEWS.slice(0, 3).map((client, index) => (
            <Clients
              key={index}
              name={client.name}
              imgid={client.imgid}
              review={client.review}
              role={client.role}
            />
          ))}
        </div>
        <FaArrowAltCircleRight className="text-red-500 text-6xl font-bold hover:scale-110" />
      </div>
    </section>
  );
};

export default OurClients;
