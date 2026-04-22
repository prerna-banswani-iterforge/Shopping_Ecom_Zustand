import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useStore from "../store/useStore";

function Navbar() {
  const cart = useStore((state) => state.cart);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 ">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="text-white text-xl font-bold">
          ShopEasy
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-8">
          {/* Products */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold border-b-2 border-white pb-0.5"
                : "text-gray-300 hover:text-white"
            }
          >
            Products
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold border-b-2 border-white pb-0.5"
                : "text-gray-300 hover:text-white"
            }
          >
            Wishlist
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${
                isActive
                  ? "text-white font-semibold border-b-2 border-white pb-0.5"
                  : "text-gray-300 hover:text-white"
              } relative`
            }
          >
            Cart
            {/* Badge */}
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
