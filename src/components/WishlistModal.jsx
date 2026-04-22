import React, { useState } from "react";
import useStore from "../store/useStore";

function WishlistModal({ product, onClose }) {
  const [selectedWishlistId, setSelectedWishlistId] = useState("");

  const wishlists = useStore((state) => state.wishlists);
  const addToWishlist = useStore((state) => state.addToWishlist);

  // When dropdown changes
  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setSelectedWishlistId(value);
  };

  const handleConfirm = async () => {
    if (!selectedWishlistId) {
      alert("Please select a wishlist");
      return;
    }
    await addToWishlist(product, parseInt(selectedWishlistId));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add to Wishlist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            X
          </button>
        </div>

        {/* Dropdown */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Wishlist
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 mb-3"
          value={selectedWishlistId}
          onChange={handleDropdownChange}
        >
          <option value="">Choose a wishlist...</option>
          {wishlists.map((w) => (
            <option key={w.id} value={w.id}>
              {w.wishlistName}
            </option>
          ))}
        </select>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistModal;
