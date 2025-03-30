import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/api';
import { Product } from '../../types';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Package,
    AlertCircle,
    ShoppingCart,
    Search,
    ArrowLeft,
    SlidersHorizontal,
    Star
} from 'lucide-react';
import debounce from 'lodash/debounce';

// Cart Dropdown Component
const CartDropdown: React.FC<{ items: any[] }> = ({ items }) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-700">Shopping Cart ({items.length})</p>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
            <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover rounded" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 line-clamp-1">{item.title}</p>
              <p className="text-sm font-medium text-purple-600">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
        <Link 
          to="/checkout" 
          className="block w-full text-center bg-purple-600 text-white py-2 hover:bg-purple-700 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar: React.FC = () => {
  const { cart } = useCart();
  const user = null;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-purple-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold">INTERNSHIP</Link>
            </div>
            <div className="hidden md:flex md:ml-8 space-x-8">
              <Link to="/" className="text-white hover:text-purple-200">Home</Link>
              <Link to="/shop" className="text-white hover:text-purple-200">Shop</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <Link 
                to="/cart" 
                className="relative p-1 rounded-full hover:bg-purple-500 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.items.length > 0 && (
                  <span className="absolute top-1 -right-0 bg-red-500 text-white 
                                 text-xs rounded-full h-5 w-5 flex items-center 
                                 justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              {showDropdown && cart.items.length > 0 && (
                <CartDropdown items={cart.items} />
              )}
            </div>
            {user ? (
              <button className="px-4 py-2 bg-white text-purple-600 
                               hover:bg-purple-100 font-medium  
                               transition-colors">
                Account
              </button>
            ) : (
              <button className="px-4 py-2 bg-white text-purple-600 
                               hover:bg-purple-100 font-medium  
                               transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Loading Grid Component
const LoadingGrid: React.FC = () => (
  <div className="flex h-screen">
    <div className="flex-1">
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12">
    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  
  const isInCart = cart.items.some(item => item.id === product.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`${product.title} added to cart`);
    }
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div 
      onClick={() => navigate(`/shop/${product.id}`)}
      className="group relative bg-white shadow-sm hover:shadow-md 
                transition-all duration-200 overflow-hidden flex flex-col h-full
                cursor-pointer"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-105 
                   transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 
                        py-1 text-xs font-medium rounded-full">
            -{product.discountPercentage.toFixed(0)}%
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-yellow-500 font-medium uppercase">
              {product.category}
            </p>
            <div className="flex items-center">
              <span className={`text-xs ${
                product.stock > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>
          <h3 className="text-base font-semibold text-purple-500 line-clamp-1 mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < Math.round(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.rating})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {product.discountPercentage > 0 ? (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${discountedPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-3 py-2 
              ${isInCart 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-purple-500 hover:bg-purple-600'
              } 
              text-white transition-colors duration-200
              disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 
              ? 'Out of Stock'
              : isInCart 
                ? 'In Cart' 
                : 'Add to Cart'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Filters Component
interface FiltersProps {
  onPriceRangeChange: (min: number, max: number) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  selectedSort: string;
}

const Filters: React.FC<FiltersProps> = ({
  onPriceRangeChange,
  onCategoryChange,
  onSortChange,
  selectedCategory,
  selectedSort
}) => {
  const categories = [
    "All",
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration"
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" }
  ];

  return (
    <div className="bg-white p-4 shadow-sm space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left px-2 py-1 rounded 
                        ${selectedCategory === category
                          ? "bg-purple-100 text-purple-600"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Sort By</h3>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border focus:ring-2 
                   focus:ring-purple-500 focus:border-purple-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border focus:ring-2 
                     focus:ring-purple-500 focus:border-purple-500"
            onChange={(e) => onPriceRangeChange(
              Number(e.target.value), 
              Infinity
            )}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border focus:ring-2 
                     focus:ring-purple-500 focus:border-purple-500"
            onChange={(e) => onPriceRangeChange(
              0, 
              Number(e.target.value)
            )}
          />
        </div>
      </div>
    </div>
  );
};

// Main ShopList Component
const ShopList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page, searchQuery],
    queryFn: () =>
      searchQuery
        ? productService.searchProducts(searchQuery)
        : productService.fetchProducts(page),
    staleTime: 5000
  });

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filteredProducts = (data?.products || []).filter((product) => {
    const matchesCategory = selectedCategory === "All" || 
                          product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && 
                       product.price <= priceRange.max;
    return matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-purple-600">Our Products</h1>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border 
                         focus:ring-2 focus:ring-purple-500 
                         focus:border-purple-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => document.getElementById('filters')?.classList.toggle('hidden')}
              className="p-2 bg-white border hover:bg-gray-50 md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div id="filters" className="hidden md:block w-64 flex-shrink-0">
            <Filters
              onPriceRangeChange={(min, max) => setPriceRange({ min, max })}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSelectedSort}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
            />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <LoadingGrid />
            ) : isError ? (
              <ErrorState message={error.message} />
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {sortedProducts.length} products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No products found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}

                {!searchQuery && sortedProducts.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="mx-1 px-4 py-2 border 
                               disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="mx-4 py-2">Page {page}</span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!data?.products.length}
                      className="mx-1 px-4 py-2 border 
                               disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopList;