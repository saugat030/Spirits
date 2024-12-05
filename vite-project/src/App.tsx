import "./App.css";
import NavBar from "./Components/NavBar";
import Landing from "./Components/Landing";
import PopularNow from "./Components/PopularNow";
import BestSelling from "./Components/BestSelling";
function App() {
  return (
    <div className="font-Poppins">
      <NavBar />
      <Landing></Landing>
      <PopularNow />
      <BestSelling />
    </div>
  );
}

export default App;
