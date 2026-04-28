import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";

function Wishlist() {
  const [activeWishlistId, setActiveWishlistId] = useState(null);

  const wishlists = useStore((state) => state.wishlists);
  const wishlistsLoading = useStore((state) => state.wishlistsLoading);
  const wishlistsLoaded = useStore((state) => state.wishlistsLoaded);
  const fetchWishlists = useStore((state) => state.fetchWishlists);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const deleteWishlist = useStore((state) => state.deleteWishlist);

  useEffect(() => {
    console.log("[Wishlist] Page");
    fetchWishlists();
  }, []);

  useEffect(() => {
    console.log("[Wishlist] Wishlists updated, total:", wishlists.length);

    // If no tab selected yet → select first wishlist
    if (wishlists.length > 0 && activeWishlistId === null) {
      console.log("[Wishlist] Auto-selecting");
      setActiveWishlistId(wishlists[0].id);
    }

    // If the currently active wishlist was deleted → select first remaining
    if (activeWishlistId !== null) {
      const stillExists = wishlists.some((w) => w.id === activeWishlistId);
      if (!stillExists && wishlists.length > 0) {
        console.log("[Wishlist] Active wishlist deleted");
        setActiveWishlistId(wishlists[0].id);
      }
    }
  }, [wishlists]);

  const activeWishlist = wishlists.find((w) => w.id === activeWishlistId);

  if (wishlistsLoading && !wishlistsLoaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-lg">Loading wishlists...</p>
      </div>
    );
  }

  const handleDeleteWishlist = async () => {
    if (!activeWishlist) return;

    if (
      window.confirm(
        `Delete "${activeWishlist.wishlistName}"? This cannot be undone.`,
      )
    ) {
      console.log("[Wishlist] Deleting wishlist:", activeWishlist.id);
      // Reset active tab - useEffect above will auto-select first remaining
      setActiveWishlistId(null);
      await deleteWishlist(activeWishlist.id);
    }
  };

  const handleRemoveProduct = (productId, productName) => {
    console.log("[Wishlist] Removing product:");
    removeFromWishlist(activeWishlistId, productId);
  };

  if (wishlistsLoaded && wishlists.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No wishlists yet
        </h2>
        <Link
          to="/"
          className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlists</h1>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {wishlists.map((wishlist) => (
          <button
            key={wishlist.id}
            onClick={() => {
              setActiveWishlistId(wishlist.id);
            }}
            className={`
              px-5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${
                activeWishlistId === wishlist.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }
            `}
          >
            {wishlist.wishlistName}
          </button>
        ))}
      </div>

      {activeWishlist && (
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeWishlist.wishlistName}
            </h2>
            <button
              onClick={handleDeleteWishlist}
              className="text-sm text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete Wishlist
            </button>
          </div>

          {activeWishlist.products.length === 0 ? (
            // Empty wishlist state
            <div className="text-center py-16 text-gray-400">
              <p className="text-base mb-4"> Wishlist is empty.</p>
              <Link
                to="/"
                className="inline-block bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeWishlist.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="bg-white h-40 flex items-center justify-center p-3">
                    <img
                      src={product.imageUrl}
                      className="max-h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-bold text-base mb-3">
                      ₹{product.price}
                    </p>

                    {/* Remove from wishlist button */}
                    <button
                      onClick={() =>
                        handleRemoveProduct(product.id, product.name)
                      }
                      className="w-full text-sm border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
