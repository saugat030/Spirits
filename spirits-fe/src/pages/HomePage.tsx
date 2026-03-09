import NavBar from "../components/NavBar";
import Hero from "../components/Landing";
import BestSelling from "../components/BestSelling";
import Years from "../components/Years";
import Footer from "../components/Footer";
import OurClients from "../components/OurClients";
import WhyUs from "../components/WhyUS";

const HomePage = () => {
  return (
    <div className="font-Poppins scroll-smooth overflow-hidden">
      <NavBar page="home" />
      <Hero />
      <WhyUs />
      <BestSelling />
      <Years />
      <OurClients />
      <Footer />
    </div>
  );
};

export default HomePage;
