import NavBar from "../Components/NavBar";
import Landing from "../Components/Landing";
import BestSelling from "../Components/BestSelling";
import Years from "../Components/Years";
import Footer from "../Components/Footer";
import OurClients from "../Components/OurClients";
import WhyUs from "../Components/WhyUS";

const HomePage = () => {
  return (
    <div className="font-Poppins scroll-smooth overflow-hidden">
      <NavBar page="home" />
      <Landing />
      <WhyUs />
      <BestSelling />
      <Years />
      <OurClients />
      <Footer />
    </div>
  );
};

export default HomePage;
