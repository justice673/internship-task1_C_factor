import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Trash2, MinusCircle, PlusCircle, ShoppingBag, ArrowLeft, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// Loading Component to match shop page
const LoadingSpinner = () => (
    <div className="flex h-screen">
        <div className="flex-1">
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
                    <p className="text-gray-500 font-medium">Loading cart...</p>
                </div>
            </div>
        </div>
    </div>
);

export const CartPage = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state (remove this in production)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
                <ShoppingBag className="w-16 h-16 text-purple-500" />
                <h2 className="text-2xl font-semibold text-purple-500 text-center">Your cart is empty</h2>
                <p className="text-gray-500 text-center">Start shopping to add items to your cart!</p>
                <Link
                    to="/shop"
                    className="mt-4 px-6 py-2 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                >
                    <Store className="w-4 h-4" />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header - Styled to match shop page */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center text-purple-500 hover:underline"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Shop
                    </button>
                    <h1 className="text-2xl font-bold text-purple-500">Shopping Cart</h1>
                </div>

                {/* Main Content */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-white shadow-sm border border-gray-100 hover:border-purple-200 transition-all duration-200"
                            >
                                {item.image && (
                                    <div className="relative w-full sm:w-24 h-40 sm:h-24 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-lg sm:text-base">{item.title}</h3>
                                        <p className="text-purple-500 font-medium mt-1">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2">
                                            <button
                                                className="text-purple-500 hover:text-purple-600 transition-colors disabled:text-gray-300"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <MinusCircle className="w-5 h-5" />
                                            </button>
                                            <span className="w-8 text-center font-medium text-gray-700">{item.quantity}</span>
                                            <button
                                                className="text-purple-500 hover:text-purple-600 transition-colors"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <PlusCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 lg:mt-0">
                        <div className="bg-white shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${cart.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between text-lg font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span>${cart.total.toFixed(2)}</span>
                                </div>
                            </div>


                            <Link to="/checkout">
                                <button className="w-full mt-6 px-6 py-3 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 font-medium">
                                    Proceed to Checkout
                                </button>
                            </Link>

                            <div className="mt-4 text-sm text-gray-500 text-center">
                                <p>Free shipping on all orders</p>
                                <p className="mt-1">Estimated delivery: 2-4 business days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};