import NavBar from "../Components/NavBar";
import Hero from "../Components/Landing";
import BestSelling from "../Components/BestSelling";
import Years from "../Components/Years";
import Footer from "../Components/Footer";
import OurClients from "../Components/OurClients";
import WhyUs from "../Components/WhyUS";

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
