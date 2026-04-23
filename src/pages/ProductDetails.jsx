import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../store/useStore";
import WishlistModal from "../components/WishlistModal.jsx";

const BASE_URL = "http://localhost:3000";

function ProductDetails() {
  // useParams reads :id from the URL → /product/3 gives { id: "3" }
  const { id } = useParams();
  const navigate = useNavigate();

  // Local state for this specific product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wishlist modal state
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  // Get actions from store
  const addToCart = useStore((state) => state.addToCart);
  const fetchWishlists = useStore((state) => state.fetchWishlists);
  const fetchCart = useStore((state) => state.fetchCart);

  // Fetch this product when the id in URL changes
  useEffect(() => {
    console.log("[ProductDetails] Loading product id:", id);

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("[ProductDetails] Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    fetchWishlists();
    fetchCart();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Image */}
        <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-8 min-h-72">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-72 object-contain"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          {/* Category badge */}
          <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full capitalize w-fit mb-3">
            {product.parentCategoryId}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-2xl font-bold text-green-600 mb-4">
            ₹{product.price}
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <hr className="mb-6 border-gray-200" />

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setShowWishlistModal(true)}
              className="flex-1 border-2 border-gray-300 hover:border-red-400 hover:text-red-500 font-semibold py-3 px-6 rounded-xl transition-colors text-gray-600"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <WishlistModal
          product={product}
          onClose={() => setShowWishlistModal(false)}
        />
      )}
    </div>
  );
}

export default ProductDetails;
