import Hero from "../components/Landing";
import BestSelling from "../components/BestSelling";
import Years from "../components/Years";
import OurClients from "../components/OurClients";
import WhyUs from "../components/WhyUS";

const HomePage = () => {
  return (
    <div className="scroll-smooth">
      <Hero />
      <WhyUs />
      <BestSelling />
      <Years />
      <OurClients />
    </div>
  );
};

export default HomePage;
