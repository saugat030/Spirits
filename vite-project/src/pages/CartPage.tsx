import NavBar from "../Components/NavBar";
import Cart from "../Components/Cart";
import Footer from "../Components/Footer";

const CartPage = () => {
  return (
    <div className="font-Poppins overflow-hidden">
      <NavBar page="cart" />
      <div className="flex w-full gap-12 p-6">
        <Cart />
      </div>
      <Footer size="this" />
    </div>
  );
};
export default CartPage;
