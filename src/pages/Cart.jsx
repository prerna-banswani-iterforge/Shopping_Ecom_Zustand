import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";

const SHIPPING = 50;
const TAX_RATE = 0.05;

function Cart() {
  const cart = useStore((state) => state.cart);
  const cartLoading = useStore((state) => state.cartLoading);
  const cartLoaded = useStore((state) => state.cartLoaded);
  const fetchCart = useStore((state) => state.fetchCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  useEffect(() => {
    console.log("[Cart] Page mounted - fetching cart from server...");
    fetchCart();
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING + tax;

  if (cartLoading && !cartLoaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-lg">Loading cart...</p>
      </div>
    );
  }

  if (cartLoaded && cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700"
        >
          ← Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT*/}
        <div className="flex-1">
          <div className="bg-white rounded-xl overflow-hidden">
            {cart.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-bold text-base mt-0.5">
                      ₹{item.price}
                    </p>
                  </div>
                  {/* Decrease button */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => {
                        console.log("[Cart] Decreasing qty");
                        updateCartQuantity(item.id, item.quantity - 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded font-bold"
                    >
                      -
                    </button>

                    <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                      {item.quantity}
                    </span>

                    {/* Increase button */}
                    <button
                      onClick={() => {
                        console.log(
                          "[Cart] Increasing qty for:",
                          item.name,
                          "→",
                          item.quantity + 1,
                        );
                        updateCartQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      console.log("[Cart] Removing item directly:", item.name);
                      removeFromCart(item.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors text-xl font-light ml-1"
                    title="Remove item"
                  >
                    X
                  </button>
                </div>
                {index < cart.length - 1 && (
                  <hr className="border-gray-100 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium text-gray-800">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-800">₹{SHIPPING}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Tax (5%)</span>
                <span className="font-medium text-gray-800">
                  ₹{tax.toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800 text-base">Total</span>
              <span className="font-bold text-green-600 text-xl">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-sm text-gray-400 hover:text-gray-700 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
