import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltRight, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCreateOrder } from "../services/api/ordersApi";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import NavBar from "../components/NavBar";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const userData = useAuthStore((state) => state.userData);

  const [shippingAddress, setShippingAddress] = useState(
    userData?.address || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createOrder } = useCreateOrder();

  const subtotal = cartItems.reduce((total, item) => {
    const variant = item.product.variants.find(
      (v) => v.id === item.selectedVariantId
    );
    const price = variant?.discountedPrice || item.product.minDiscountedPrice;
    return total + price * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cartItems.map((item) => ({
        variantId: item.selectedVariantId,
        quantity: item.quantity,
      })),
      shippingAddress: shippingAddress.trim(),
      paymentMethod: "cod" as const,
    };

    createOrder(orderData, {
      onSuccess: (response) => {
        if (response.success) {
          clearCart();
          toast.success("Order placed successfully!");
          navigate("/orders");
        } else {
          toast.error(response.message || "Failed to place order");
          setIsSubmitting(false);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to place order");
        setIsSubmitting(false);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="font-Poppins min-h-screen bg-gray-50">
        <NavBar page="notHome" />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products before checking out.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-Poppins min-h-screen bg-gray-50">
      <NavBar page="notHome" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <Link to="/cart" className="hover:text-amber-600 transition-colors">
            Cart
          </Link>
          <FaLongArrowAltRight className="text-gray-400 text-xs" />
          <span className="text-gray-900">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="text-amber-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full shipping address..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
              {!userData?.address && (
                <p className="text-sm text-gray-500 mt-2">
                  Save your address in your profile for faster checkout next time.
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCreditCard className="text-amber-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={true}
                  readOnly
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="cod" className="flex-1">
                  <span className="font-semibold text-gray-900">
                    Cash on Delivery
                  </span>
                  <span className="block text-sm text-gray-500">
                    Pay when you receive your order
                  </span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Other payment options (Stripe, eSewa, PayPal) coming soon.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
                {cartItems.map((item) => {
                  const variant = item.product.variants.find(
                    (v) => v.id === item.selectedVariantId
                  );
                  const price =
                    variant?.discountedPrice || item.product.minDiscountedPrice;

                  return (
                    <div key={item.selectedVariantId} className="flex gap-3">
                      <img
                        src={item.product.thumbnail_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {variant?.size} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Rs. {price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !shippingAddress.trim()}
                className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader color="#ffffff" size={20} />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              {!shippingAddress.trim() && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Please enter a shipping address to place your order.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
