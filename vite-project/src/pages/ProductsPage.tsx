import NavBar from "../Components/NavBar";
import ShopByCategs from "../Components/ShopByCategs";
import MostPopular from "../Components/MostPopular";
import Footer from "../Components/Footer";
const ProductsPage = () => {
  return (
    <div className="font-Poppins">
      <NavBar page="products" />
      <ShopByCategs />
      <MostPopular />
      <Footer></Footer>
    </div>
  );
};

export default ProductsPage;
