import React, { useState, useEffect } from "react";
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
    PlusCircle,
    X,
    AlertTriangle
} from 'lucide-react';
import Sidebar from '../../../layouts/Sidebar';
import { Product, AlertModalProps, ProductCardProps, ProductModalProps } from '../../../types/index';
import { productService } from '../../../services/api';

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// Alert Modal Component
const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-xl max-w-md w-full">
                <div className="flex items-center space-x-3 text-red-600 mb-4">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors 
                                 border border-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 
                                 transition-colors rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Product Modal Component
const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setPrice(initialData.price.toString());
            setCategory(initialData.category);
            setBrand(initialData.brand);
            setThumbnail(initialData.thumbnail);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            title,
            description,
            price: parseFloat(price),
            category,
            brand,
            thumbnail,
            discountPercentage: initialData?.discountPercentage || 0,
            rating: initialData?.rating || 0,
            stock: initialData?.stock || 0,
            images: initialData?.images || [],
            ...(initialData && { id: initialData.id }),
            isLocal: true
        };
        onSubmit(productData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('');
        setBrand('');
        setThumbnail('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md shadow-xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-purple-500">
                            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:text-red-500 transition-colors rounded-full 
                                     hover:bg-red-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thumbnail URL
                            </label>
                            <input
                                type="url"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                className="w-full p-2 border border-gray-300 focus:ring-2 
                                         focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white py-2 px-4 
                                     hover:bg-purple-600 transition-colors duration-200"
                        >
                            {mode === 'add' ? 'Add Product' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
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
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(product);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-purple-500 text-white hover:bg-purple-600 
                                transition-colors duration-200"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(product.id);
                        }}
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const limit = 10;

    // Load local products from localStorage
    useEffect(() => {
        const savedProducts = localStorage.getItem('localProducts');
        if (savedProducts) {
            setLocalProducts(JSON.parse(savedProducts));
        }
    }, []);

    // Save local products to localStorage when they change
    useEffect(() => {
        localStorage.setItem('localProducts', JSON.stringify(localProducts));
    }, [localProducts]);

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

    const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
        const product = {
            ...newProduct,
            id: Date.now(),
            isLocal: true,
        } as Product;
        setLocalProducts(prevProducts => [product, ...prevProducts]);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleUpdateProduct = (updatedProduct: Product | Omit<Product, 'id'>) => {
        if ('id' in updatedProduct && updatedProduct.isLocal) {
            setLocalProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
        }
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        const productToDeleteObj = localProducts.find(p => p.id === productToDelete);
        
        if (productToDeleteObj) {
            setLocalProducts(prevProducts => 
                prevProducts.filter(product => product.id !== productToDelete)
            );
        }
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

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

    const apiProducts = data?.products || [];
    const allProducts = [...localProducts, ...apiProducts];
    const totalProducts = (data?.total || 0) + localProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                    onClick={() => {
                                        setModalMode('add');
                                        setEditingProduct(null);
                                        setIsModalOpen(true);
                                    }}
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

                    <ProductModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingProduct(null);
                        }}
                        onSubmit={modalMode === 'add' ? handleAddProduct : handleUpdateProduct}
                        initialData={editingProduct || undefined}
                        mode={modalMode}
                    />

                    <AlertModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setProductToDelete(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Product"
                        message="Are you sure you want to delete this product? This action cannot be undone."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>

                    {allProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-purple-500">No products</h3>
                            <p className="mt-1 text-sm text-purple-500">
                                No products are available at the moment.
                            </p>
                        </div>
                    )}

                    {allProducts.length > 0 && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center border border-gray-300 
                                             bg-white px-4 py-2 text-sm font-medium text-gray-700 
                                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= totalPages}
                                    className="relative ml-3 inline-flex items-center border border-gray-300 
                                             bg-white px-4 py-2 text-sm font-medium text-gray-700 
                                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="relative inline-flex items-center px-3 py-2 text-sm 
                                                 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
                                                 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="relative inline-flex items-center px-3 py-2 text-sm 
                                                 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
                                                 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
