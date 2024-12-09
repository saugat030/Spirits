import "./App.css";
import NavBar from "./Components/NavBar";
import Landing from "./Components/Landing";
import WhyUs from "./Components/WhyUS";
import BestSelling from "./Components/BestSelling";
import Years from "./Components/Years";
import Footer from "./Components/Footer";
function App() {
  return (
    <div className="font-Poppins">
      <NavBar />
      <Landing></Landing>
      <WhyUs />
      <BestSelling />
      <Years />
      <Footer />
    </div>
  );
}

export default App;
