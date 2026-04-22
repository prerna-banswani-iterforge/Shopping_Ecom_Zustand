// components/ProductCard.jsx
// Reusable product card used in the Home page grid
// Props:
//   product       - the product object
//   onAddToWishlist - function called when wishlist button clicked
//                    (opens the wishlist modal in Home page)

import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

function ProductCard({ product, onAddToWishlist }) {
  const navigate = useNavigate();

  // Get addToCart action from Zustand store
  const addToCart = useStore((state) => state.addToCart);

  console.log("[ProductCard] Rendering:", product.name);

  // Navigate to Product Details page when card is clicked
  const handleCardClick = () => {
    console.log("[ProductCard] Navigating to product:", product.id);
    navigate(`/product/${product.id}`);
  };

  // Add to cart - stopPropagation so card click doesn't fire too
  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("[ProductCard] Add to cart:", product.name);
    addToCart(product);
  };

  // Open wishlist modal - stopPropagation
  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    console.log("[ProductCard] Wishlist clicked for:", product.name);
    onAddToWishlist(product); // Lift up to parent (Home.jsx)
  };

  return (
    <div
      className="bg-white rounded-xl hover:shadow transition-shadow cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="bg-gray-100 rounded-t-xl flex items-center justify-center h-48">
        <img src={product.imageUrl} alt={product.name} className="max-h-44" />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 mb-1 text-sm">
          {product.name}
        </h3>
        <p className="text-green-600 font-bold text-lg mb-4">
          ₹{product.price}
        </p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg"
          >
            Add to Cart
          </button>
          <button className="px-2 py-2 border border-gray-300 hover:border-red-400 hover:text-red-500 rounded-lg text-gray-500 transition-colors text-sm">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
