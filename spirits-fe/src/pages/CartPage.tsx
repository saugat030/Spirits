import NavBar from "../components/NavBar";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

const CartPage = () => {
  return (
    <div className="font-Poppins overflow-hidden">
      <NavBar page="cart" />
      <div className="flex w-full gap-12 p-6">
        <Cart />
      </div>
      <Footer />
    </div>
  );
};
export default CartPage;
