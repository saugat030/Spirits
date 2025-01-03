import NavBar from "../Components/NavBar";
import Cart from "../Components/Cart";
import Footer from "../Components/Footer";
import OrderSummary from "../Components/OrderSummary";

const CartPage = () => {
  return (
    <div className="font-Poppins w-screen">
      <NavBar page="cart" />
      <div className="flex w-full gap-12">
        <Cart />
        <OrderSummary />
      </div>
      <Footer size="jello" />
    </div>
  );
};
export default CartPage;
