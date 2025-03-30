import  React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Package,
    AlertCircle,
    ArrowLeft,
    Pencil,
    Trash2,
    PlusCircle
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Product } from '../../../types/index';
import { productService } from '../../../services/api';

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        // Add your edit logic here
        console.log('Edit product:', product.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        // Add your delete logic here
        console.log('Delete product:', product.id);
    };

    return (
        <div className="group relative bg-white shadow-sm hover:shadow-md 
                transition-all duration-200 overflow-hidden flex flex-col h-full">
            <Link
                to={`/products/${product.id}`}
                className="flex flex-col flex-1"
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
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                        <p className="text-xs text-yellow-500 mb-1">{product.category}</p>
                        <h3 className="text-base font-semibold text-purple-500 line-clamp-1 mb-1">
                            {product.title}
                        </h3>
                        <p className="text-sm text-black line-clamp-2 mb-2">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                            ${product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-yellow-500 font-medium">
                            {product.brand}
                        </span>
                    </div>
                </div>
            </Link>
            
            <div className="p-4 pt-0 mt-auto border-t">
                <div className="flex gap-2">
                    <button
                        onClick={handleEdit}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-purple-500 text-white hover:bg-purple-600 
                                transition-colors duration-200"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-gray-400 text-white hover:bg-gray-600 
                                transition-colors duration-200"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </button>
            </div>
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Failed to load products
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                    {message}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 
                     transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        </div>
    </div>
);

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, error } = useQuery<ProductResponse, Error>({
        queryKey: ["products", page],
        queryFn: async () => {
            const skip = (page - 1) * limit;
            return await productService.fetchProducts(skip, limit);
        },
        placeholderData: () => ({
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        }),
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
    

    if (isLoading) return (
        <div className="flex h-screen">
            <Sidebar />
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

    if (isError) return <ErrorState message={error.message} />;

    const products = data?.products || [];
    const totalProducts = data?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header - Updated for better mobile responsiveness */}
                    <div className="mb-8 bg-white p-4 sm:p-6 shadow-sm">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-purple-500 hover:underline mb-4"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Dashboard
                        </button>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center sm:justify-between">
                            <h1 className="text-2xl font-bold text-purple-500">All Products</h1>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <p className="text-sm text-gray-600 whitespace-nowrap">
                                    Total Products: <span className="font-medium text-purple-500">{totalProducts}</span>
                                </p>
                                <button
                                    onClick={() => navigate('/products/new')}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 
                                             bg-purple-500 text-white hover:bg-purple-600 
                                             transition-colors duration-200"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    Add New Product
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rest of the component remains the same */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-purple-500">No products</h3>
                            <p className="mt-1 text-sm text-purple-500">
                                No products are available at the moment.
                            </p>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center border 
                                            border-gray-300 bg-white px-4 py-2 text-sm font-medium 
                                            text-gray-700 hover:bg-gray-50 disabled:opacity-50 
                                            disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= totalPages}
                                    className="relative ml-3 inline-flex items-center 
                                            border border-gray-300 bg-white px-4 py-2 text-sm 
                                            font-medium text-gray-700 hover:bg-gray-50 
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {totalProducts === 0 ? 0 : (page - 1) * limit + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(page * limit, totalProducts)}
                                        </span>{' '}
                                        of <span className="font-medium">{totalProducts}</span> results
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-3 py-2 
                                                text-sm font-semibold text-gray-900 ring-1 
                                                ring-inset ring-gray-300 hover:bg-gray-50 
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={page >= totalPages}
                                        className="relative inline-flex items-center px-3 py-2 
                                                text-sm font-semibold text-gray-900 ring-1 
                                                ring-inset ring-gray-300 hover:bg-gray-50 
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;