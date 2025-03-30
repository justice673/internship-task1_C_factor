// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/pages/Dashboard";
import ProductList from "../pages/dashboard/pages/Products";
import PostsList from "../pages/dashboard/pages/Posts";
import CommentsList from "../pages/dashboard/pages/Comments";
import Home from "../pages/app/Home";
import ShopList from "../pages/app/Shop";
import ProductDetails from "../pages/app/ProductDetails";
import { CartPage } from "../pages/app/Cart";
import CheckoutPage from "../pages/app/Checkout";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<ShopList />} />
      <Route path="/shop/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <PostsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comments"
        element={
          <ProtectedRoute>
            <CommentsList />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
