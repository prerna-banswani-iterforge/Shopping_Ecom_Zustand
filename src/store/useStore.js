import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useStore = create((set, get) => ({
  // state var

  products: [],
  categories: [],
  cart: [],
  wishlists: [],

  fetchProducts: async () => {
    try {
      console.log("[Store] Fetching products...");
      const res = await axios.get(`${BASE_URL}/products`);
      set({ products: res.data });
      console.log("[Store] Products loaded:", res.data.length);
    } catch (error) {
      console.error("[Store] Error fetching products:", error);
    }
  },

  fetchProductsByCategory: async (categoryId) => {
    try {
      const url =
        categoryId === "all"
          ? `${BASE_URL}/products`
          : `${BASE_URL}/products?parentCategoryId=${categoryId}`;

      const res = await axios.get(url);
      set({ products: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCategories: async () => {
    try {
      console.log("[Store] Fetching categories...");
      const res = await axios.get(`${BASE_URL}/categories`);
      set({ categories: res.data });
      console.log("[Store] Categories loaded:", res.data);
    } catch (error) {
      console.error("[Store] Error fetching categories:", error);
    }
  },

  fetchCart: async () => {
    try {
      console.log("[Store] Fetching cart...");
      const res = await axios.get(`${BASE_URL}/cart`);
      set({ cart: res.data });
      console.log("CArt fetched");
    } catch (error) {
      console.error("[Store] Error fetching cart:", error);
    }
  },

  addToCart: async (product) => {
    try {
      const { cart } = get();
      console.log("Store: Adding to cart:", product.name);

      const existingItem = cart.find((item) => item.productId === product.id);

      if (existingItem) {
        // Product exists - update quantity
        const newQty = existingItem.quantity + 1;
        await axios.patch(`${BASE_URL}/cart/${existingItem.id}`, {
          quantity: newQty,
        });
        console.log("New qty added");
        alert(`${product.name} quantity updated to ${newQty}!`);
      } else {
        // New product - add to cart
        await axios.post(`${BASE_URL}/cart`, {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        });
        console.log("Store: Added new item to cart");
        alert(`${product.name} added to cart!`);
      }

      // Refresh cart state
      get().fetchCart();
    } catch (error) {
      console.error("[Store] Error adding to cart:", error);
      alert("Failed to add to cart. Make sure json-server is running.");
    }
  },

  fetchWishlists: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist`);
      set({ wishlists: res.data });
      console.log("[Store] Wishlists loaded:", res.data.length);
    } catch (error) {
      console.error("[Store] Error fetching wishlists:", error);
    }
  },

  addToWishlist: async (product, wishlistId) => {
    try {
      const { wishlists } = get();
      console.log("[Store] Adding to wishlist");

      const wishlist = wishlists.find((w) => w.id === wishlistId);
      if (!wishlist) {
        alert("Wishlist not found");
        return;
      }

      // Check if product already in wishlist
      const alreadyExists = wishlist.products.some((p) => p.id === product.id);
      if (alreadyExists) {
        alert(`${product.name} is already in this wishlist!`);
        return;
      }

      const updatedProducts = [
        ...wishlist.products,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          parentCategoryId: product.parentCategoryId,
        },
      ];

      await axios.patch(`${BASE_URL}/wishlist/${wishlistId}`, {
        products: updatedProducts,
      });
      get().fetchWishlists();
      alert(`${product.name} added to ${wishlist.wishlistName}!`);
    } catch (error) {
      console.error("[Store] Error adding to wishlist:", error);
      alert("Failed to add to wishlist");
    }
  },
}));

export default useStore;
