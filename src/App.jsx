import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import Layout from "./components/Layout.jsx";

// createBrowserRouter - define routes as a config array
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetails /> }, // "/product/3"
    ],
  },
]);

console.log("[App] Router created with createBrowserRouter");

function App() {
  // RouterProvider takes our config and handles all routing
  return <RouterProvider router={router} />;
}

export default App;
