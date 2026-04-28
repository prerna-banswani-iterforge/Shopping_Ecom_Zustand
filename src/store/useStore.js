import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useStore = create((set, get) => ({
  // state var

  products: [],
  categories: [],
  cart: [],
  wishlists: [],
  productsLoading: false,
  productsLoaded: false,
  categoriesLoading: false,
  categoriesLoaded: false,
  cartLoading: false,
  cartLoaded: false,
  wishlistsLoading: false,
  wishlistsLoaded: false,

  toast: {
    show: false,
    message: "",
    type: "success",
  },

  showToast: (message, type = "success") => {
    set({ toast: { show: true, message, type } });

    setTimeout(() => {
      set({ toast: { show: false, message: "", type: "success" } });
    }, 10000);
  },

  fetchProducts: async () => {
    try {
      set({ productsLoading: true });
      console.log("[Store] Fetching products...");
      const res = await axios.get(`${BASE_URL}/products`);
      set({
        products: res.data,
        productsLoading: false,
        productsLoaded: true,
      });
      console.log("[Store] Products loaded:", res.data.length);
    } catch (error) {
      set({ productsLoading: false, productsLoaded: true });
      console.error("[Store] Error fetching products:", error);
    }
  },

  fetchProductsByCategory: async (categoryId) => {
    try {
      set({ productsLoading: true });
      const url =
        categoryId === "all"
          ? `${BASE_URL}/products`
          : `${BASE_URL}/products?parentCategoryId=${categoryId}`;

      const res = await axios.get(url);
      set({
        products: res.data,
        productsLoading: false,
        productsLoaded: true,
      });
    } catch (error) {
      set({ productsLoading: false, productsLoaded: true });
      console.error(error);
    }
  },

  fetchCategories: async () => {
    try {
      set({ categoriesLoading: true });
      console.log("[Store] Fetching categories...");
      const res = await axios.get(`${BASE_URL}/categories`);
      set({
        categories: res.data,
        categoriesLoading: false,
        categoriesLoaded: true,
      });
      console.log("[Store] Categories loaded:", res.data);
    } catch (error) {
      set({ categoriesLoading: false, categoriesLoaded: true });
      console.error("[Store] Error fetching categories:", error);
    }
  },

  fetchCart: async () => {
    try {
      set({ cartLoading: true });
      console.log("[Store] Fetching cart...");
      const res = await axios.get(`${BASE_URL}/cart`);
      set({ cart: res.data, cartLoading: false, cartLoaded: true });
      console.log("CArt fetched");
    } catch (error) {
      set({ cartLoading: false, cartLoaded: true });
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
        get().showToast(
          `${product.name} quantity updated to ${newQty}!`,
          "info",
        );
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
        get().showToast(`${product.name} added to cart`, "success");
      }

      // Refresh cart state
      get().fetchCart();
    } catch (error) {
      console.error("[Store] Error adding to cart:", error);
      get().showToast("Failed to add to cart", "error");
    }
  },

  updateCartQuantity: async (cartItemId, newQuantity) => {
    try {
      console.log("[Store] Updating cart item:");

      if (newQuantity <= 0) {
        get().removeFromCart(cartItemId);
        return;
      }

      await axios.patch(`${BASE_URL}/cart/${cartItemId}`, {
        quantity: newQuantity,
      });
      get().fetchCart();
      get().showToast("Quantity updated!", "info");
    } catch (error) {
      console.error("[Store] Error updating quantity:", error);
      get().showToast("Failed to update quantity", "error");
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      console.log("[Store] Removing from cart:", cartItemId);
      await axios.delete(`${BASE_URL}/cart/${cartItemId}`);
      get().fetchCart();
      get().showToast("Item removed from cart", "error");
    } catch (error) {
      console.error("[Store] Error removing from cart:", error);
      get().showToast("Failed to remove item", "error");
    }
  },

  fetchWishlists: async () => {
    try {
      set({ wishlistsLoading: true });
      const res = await axios.get(`${BASE_URL}/wishlist`);
      set({
        wishlists: res.data,
        wishlistsLoading: false,
        wishlistsLoaded: true,
      });
      console.log("[Store] Wishlists loaded:", res.data.length);
    } catch (error) {
      set({ wishlistsLoading: false, wishlistsLoaded: true });
      console.error("[Store] Error fetching wishlists:", error);
    }
  },

  addToWishlist: async (product, wishlistId) => {
    try {
      const { wishlists } = get();
      console.log("[Store] Adding to wishlist");

      const wishlist = wishlists.find((w) => w.id === wishlistId);
      if (!wishlist) {
        get().showToast("Wishlist not found", "error");
        return;
      }

      // Check if product already in wishlist
      const alreadyExists = wishlist.products.some((p) => p.id === product.id);
      if (alreadyExists) {
        get().showToast(
          `${product.name} is already in this wishlist!`,
          "warning",
        );
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
      get().showToast(`${product.name} added to wishlist`, "success");
    } catch (error) {
      console.error("[Store] Error adding to wishlist:", error);
      alert("Failed to add to wishlist");
    }
  },

  removeFromWishlist: async (wishlistId, productId) => {
    try {
      const { wishlists } = get();

      const wishlist = wishlists.find((w) => w.id === wishlistId);
      if (!wishlist) return;

      const updatedProducts = wishlist.products.filter(
        (p) => p.id !== productId,
      );

      await axios.patch(`${BASE_URL}/wishlist/${wishlistId}`, {
        products: updatedProducts,
      });
      get().fetchWishlists();
      get().showToast("Removed From Wishlist", "error");
    } catch (error) {
      console.error("[Store] Error removing from wishlist:", error);
      alert("Failed to remove product");
    }
  },

  deleteWishlist: async (wishlistId) => {
    try {
      console.log("[Store] Deleting wishlist:", wishlistId);
      await axios.delete(`${BASE_URL}/wishlist/${wishlistId}`);
      get().fetchWishlists();
      get().showToast("Wishlist deleted", "error");
    } catch (error) {
      console.error("[Store] Error deleting wishlist:", error);
      get().showToast("Failed to delete wishlist", "error");
    }
  },

  createWishlist: async (wishlistName) => {
    try {
      await axios.post(`${BASE_URL}/wishlist`, {
        wishlistName,
        products: [],
      });
      get().fetchWishlists();
      get().showToast("Wishlist created", "success");
    } catch (error) {
      get().showToast("Failed to create wishlist", "error");
    }
  },
}));

export default useStore;
