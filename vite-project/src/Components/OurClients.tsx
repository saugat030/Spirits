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
            <h1 className="text-6xl font-semibold text-white">
              Our Happy Clients
            </h1>
          </div>
          <div className="flex w-full gap-10 justify-between container mx-auto">
            <Clients
              name="Saurav Bista"
              imgid={0}
              review="The alcohol tastes like Saugat's cum. So nostalgic , reminds me of when I used to grab his cock and go deep down inside my throat and he would jizz directly in my stomach throught the food pipe."
              role="Marketing Manager"
            />
            <Clients
              name="Samarpan Bhandari"
              imgid={1}
              review="I recently picked up a bottle of Jack Daniel's, and I couldn't be more pleased with my choice. The smoothness of this whiskey is immediately noticeable, offering a perfect balance of sweet vanilla and rich oak flavors."
              role="Marketing Manager"
            />
            <Clients
              name="Yubraj Khatiwada"
              imgid={2}
              review="The product quality is consistently outstanding, exceeding my
              expectations every time.Efficiency and punctuality are hallmarks of
              their service."
              role="Marketing Manager"
            />
          </div>
          <FaArrowAltCircleRight className="text-red-500 text-6xl font-bold hover:scale-110" />
        </div>
      </div>
    </section>
  );
};

export default OurClients;
