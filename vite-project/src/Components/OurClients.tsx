import { FaArrowAltCircleRight } from "react-icons/fa";
import Clients from "./Clients";
const OurClients = () => {
  return (
    <section>
      <div className="relative h-[900px] mt-56">
        <div className="absolute inset-0 bg-[url('src/static/Ourclients.jpg')] bg-center bg-cover bg-no-repeat bg-fixed brightness-[0.35] z-0"></div>
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
              review="This shop has an incredible variety of wines, beers, and spirits, ranging from popular brands to rare finds. The staff is always welcoming and extremely knowledgeable, offering great recommendations tailored to my taste and budget. Every visit feels like a personalized experience. Highly recommend this gem to anyone looking for quality and excellent service!"
              role="Technical Writer and SEO"
            />
            <Clients
              name="Chigga (奇加)"
              imgid={1}
              review={
                "I’ve been shopping here for years, and it never disappoints. Whether I need a fine wine for a dinner party or craft beer for a casual night, they always have the perfect options. The store is clean, well-organized, and the staff is friendly and approachable. Plus, their seasonal specials are fantastic. Definitely the best liquor store in town!"
              }
              role="Professional Footballer"
            />
            <Clients
              name="Madu Vaxo"
              imgid={2}
              review="This is hands down my favorite alcohol shop. Not only do they offer an impressive selection of products, but their customer service is what truly sets them apart. The staff is always eager to help, whether it’s finding the perfect gift or suggesting a new spirit to try."
              role="Land Lord"
            />
          </div>
          <FaArrowAltCircleRight className="text-red-500 text-6xl font-bold hover:scale-110" />
        </div>
      </div>
    </section>
  );
};

export default OurClients;
