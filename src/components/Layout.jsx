// Layout wraps every page.
// Contains Navbar (always visible) + <Outlet /> (current page)
//
// HOW Outlet WORKS:
//   URL = "/"          → Outlet renders <Home />
//   URL = "/cart"      → Outlet renders <Cart />
//   URL = "/product/3" → Outlet renders <ProductDetails />

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Toast from "./Toast.jsx";
function Layout() {
  console.log("[Layout] Rendering layout wrapper");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar always visible on every page */}
      <Navbar />
      <Toast />
      {/* Outlet = current page renders here */}
      <Outlet />
    </div>
  );
}

export default Layout;
