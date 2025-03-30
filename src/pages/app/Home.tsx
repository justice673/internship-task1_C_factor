import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    ShoppingCart,
    Menu,
    ChevronLeft,
    ChevronRight,
    Star,
    X
} from 'lucide-react';
import { Product } from '../../types';

interface Category {
    slug: string;
    name: string;
    url: string;
}

const Home: React.FC = () => {
    const { user } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryImages, setCategoryImages] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('https://dummyjson.com/products?limit=8'),
                    fetch('https://dummyjson.com/products/categories')
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData.products);

                // Filter main categories
                const mainCategories = ['smartphones', 'laptops', 'fragrances', 'skin-care', 'groceries', 'home-decoration'];
                const filteredCategories = categoriesData.filter((cat: Category) =>
                    mainCategories.includes(cat.slug)
                );

                setCategories(filteredCategories);

                // Add a small delay before fetching category images
                await new Promise(resolve => setTimeout(resolve, 500));

                // Fetch category images
                const categoryImagesPromises = filteredCategories.map(async (category: Category) => {
                    const categoryProductsRes = await fetch(
                        `https://dummyjson.com/products/category/${category.slug}?limit=1`
                    );

                    if (!categoryProductsRes.ok) {
                        throw new Error(`Failed to fetch images for category: ${category.slug}`);
                    }

                    const categoryProductsData = await categoryProductsRes.json();

                    return {
                        category: category.slug,
                        image: categoryProductsData.products[0]?.thumbnail || ''
                    };
                });

                const categoryImagesResults = await Promise.all(categoryImagesPromises);
                const imagesMap = categoryImagesResults.reduce((acc, { category, image }) => ({
                    ...acc,
                    [category]: image
                }), {});

                setCategoryImages(imagesMap);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const carouselItems = [
        {
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "Spring Collection 2025",
            description: "Discover the latest trends in fashion",
        },
        {
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "Exclusive Deals",
            description: "Up to 50% off on selected items",
        },
        {
            image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
            title: "New Arrivals",
            description: "Be the first to shop new products",
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
        return (price * (1 - discountPercentage / 100)).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-purple-600 text-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Left: Hamburger Menu & Logo */}
                        <div className="flex items-center space-x-2">
                            <button
                                className="md:hidden p-2"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                            <span className="text-2xl font-bold">INTERNSHIP</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            <Link to="/" className="hover:text-purple-200">Home</Link>
                            <Link to="/shop" className="hover:text-purple-200">Shop</Link>
                        </div>

                        {/* Right Icons (Cart & Account/Login) */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full hover:bg-purple-500">
                                <ShoppingCart className="h-5 w-5" />
                            </button>
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 bg-white text-purple-600 hover:bg-purple-100 font-medium"
                                >
                                    Account
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-white text-purple-600 hover:bg-purple-100 font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                    </div>
                </div>

                {/* Sliding Mobile Menu */}
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-purple-700 p-6 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-transform duration-300 ease-in-out md:hidden shadow-lg`}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Mobile Links */}
                    <div className="mt-8 flex flex-col space-y-6">
                        <Link
                            to="/"
                            className="text-white text-lg font-medium hover:text-purple-300 transition"
                            onClick={() => setMenuOpen(false)} // Closes menu on click
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="text-white text-lg font-medium hover:text-purple-300 transition"
                            onClick={() => setMenuOpen(false)} // Closes menu on click
                        >
                            Shop
                        </Link>
                    </div>
                </div>

                {/* Overlay when menu is open */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                        onClick={() => setMenuOpen(false)}
                    ></div>
                )}
            </nav>


            {/* Hero Carousel */}
            <div className="relative h-[600px] overflow-hidden">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-transform duration-500 ease-in-out`}
                        style={{
                            transform: `translateX(${100 * (index - currentSlide)}%)`,
                        }}
                    >
                        <div className="relative h-full">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40">
                                <div className="max-w-7xl mx-auto h-full flex items-center px-4">
                                    <div className="text-white">
                                        <h1 className="text-5xl font-bold mb-4">{item.title}</h1>
                                        <p className="text-xl mb-8">{item.description}</p>
                                        <Link to="/shop">
                                            <button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                                                Shop Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                >
                    <ChevronLeft className="h-6 w-6 text-purple-600" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                >
                    <ChevronRight className="h-6 w-6 text-purple-600" />
                </button>
            </div>

            {/* Featured Categories */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center relative pb-4">
                    <span className="relative">
                        SHOP BY CATEGORY
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-purple-600 mt-2"></span>
                    </span>
                </h2>
                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No categories found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div
                                key={category.slug}
                                className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    {categoryImages[category.slug] ? (
                                        <img
                                            src={categoryImages[category.slug]}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                console.error(`Failed to load image for category: ${category.slug}`);
                                                e.currentTarget.src = 'https://via.placeholder.com/400?text=Category';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                                            <span className="text-gray-400">Loading...</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Featured Products */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center relative pb-4">
                        <span className="relative">
                            FEATURED PRODUCTS
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-purple-600 mt-2"></span>
                        </span>
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
                                >
                                    <div className="p-4">
                                        <div className="aspect-square relative overflow-hidden mb-4">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/400?text=Product';
                                                }}
                                            />
                                            {product.discountPercentage > 0 && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm">
                                                    -{product.discountPercentage}%
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {product.discountPercentage > 0 ? (
                                                    <>
                                                        <span className="text-gray-500 line-through text-sm">${product.price}</span>
                                                        <span className="text-purple-600 font-bold">
                                                            ${calculateDiscountedPrice(product.price, product.discountPercentage)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-purple-600 font-bold">${product.price}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                                            </div>
                                        </div>
                                        {product.stock < 10 && (
                                            <p className="text-sm text-red-500 mt-2">
                                                Only {product.stock} left in stock!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
                    <p className="mb-8">Get the latest updates on new products and upcoming sales</p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 text-black"
                        />
                        <button className="px-6 py-2 bg-white text-purple-600 hover:bg-purple-100 font-medium transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
