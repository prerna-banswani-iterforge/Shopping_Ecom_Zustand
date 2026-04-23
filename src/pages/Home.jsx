import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";
import ProductCard from "../components/ProductCard.jsx";
import WishlistModal from "../components/WishlistModal.jsx";

function Home() {
  // Track active category filter
  const [activeCategory, setActiveCategory] = useState("all");

  const [wishlistProduct, setWishlistProduct] = useState(null);

  // Get state and actions from Zustand store
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const fetchCategories = useStore((state) => state.fetchCategories);
  const fetchProductsByCategory = useStore(
    (state) => state.fetchProductsByCategory,
  );
  const fetchCart = useStore((state) => state.fetchCart);
  const fetchWishlists = useStore((state) => state.fetchWishlists);

  // Load data on first render
  useEffect(() => {
    console.log("home Mounted");
    fetchProducts();
    fetchCategories();
    fetchCart();
    fetchWishlists();
  }, []);

  // Handle category pill click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    fetchProductsByCategory(categoryId);
  };

  console.log("[Home] Rendering with", products.length, "products");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-8">
        {/* "All" pill */}
        <button
          onClick={() => handleCategoryClick("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 border border-gray-300 hover:border-gray-500"
          }`}
        >
          All Products
        </button>

        {/* Dynamic category pills from API */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:border-gray-500"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        // Loading / empty state
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No Products...</p>
        </div>
      ) : (
        // Grid of ProductCards
        // grid-cols-2 on mobile, 3 on md, 4 on lg
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToWishlist={(p) => setWishlistProduct(p)}
            />
          ))}
        </div>
      )}

      {wishlistProduct && (
        <WishlistModal
          product={wishlistProduct}
          onClose={() => setWishlistProduct(null)}
        />
      )}
    </div>
  );
}

export default Home;
