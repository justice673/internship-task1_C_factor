import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  ArrowLeft, 
  ShoppingCart
} from 'lucide-react';
import { productService } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import type { Comment } from '../../services/api';

const CommentForm: React.FC<{ productId: number }> = ({ productId }) => {
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();
  
    const addCommentMutation = useMutation({
      mutationFn: (commentData: { body: string }) =>
        productService.addComment(productId, commentData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['productComments', productId] });
        toast.success('Comment added successfully!');
        setComment('');
      },
      onError: (error) => {
        toast.error(`Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      },
    });
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!comment.trim()) {
        toast.error('Please enter a comment');
        return;
      }
      addCommentMutation.mutate({ body: comment });
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full px-3 py-2 border focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none text-black bg-white"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={addCommentMutation.isPending}
          className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 
                     text-white hover:bg-purple-700 transition disabled:opacity-50"
        >
          {addCommentMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Post Comment
        </button>
      </form>
    );
};
  
const CommentList: React.FC<{ comments: Comment[] }> = ({ comments }) => (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {comment.user.username[0].toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{comment.user.username}</span>
            </div>
          </div>
          <p className="text-gray-600">{comment.body}</p>
        </div>
      ))}
    </div>
);

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || '0', 10);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const { addToCart, cart } = useCart();

  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['productComments', productId],
    queryFn: () => productService.getProductComments(productId),
    enabled: showComments,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success('Added to cart successfully!');
    }
  };

  const isInCart = product && cart.items.some(item => item.id === product.id);

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Product not found</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-500 hover:"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  const calculateDiscountedPrice = () => {
    const discount = product.price * (product.discountPercentage / 100);
    return (product.price - discount).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-500 hover:text-purple-500 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="border overflow-hidden bg-white">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer rounded
                  ${currentImageIndex === index ? 'border-2 border-purple-500' : 'opacity-50'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-3xl text-purple-500 font-bold mb-4">{product.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({product.rating})</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-green-600">
              ${calculateDiscountedPrice()}
            </span>
            <span className="ml-2 line-through text-gray-500">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
              {product.discountPercentage.toFixed(0)}% OFF
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg text-purple-500 font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-semibold text-purple-500">{product.brand}</p>
            </div>
            <div className="bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-purple-500">{product.category}</p>
            </div>
            <div className="bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Stock</p>
              <p className={`font-semibold ${
                product.stock > 10 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock} available
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              className={`flex-1 ${
                isInCart 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white px-6 py-3 transition flex items-center justify-center`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 
                ? 'Out of Stock' 
                : isInCart 
                  ? 'Added to Cart' 
                  : 'Add to Cart'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 w-full justify-between p-4
                     bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-500">Product Reviews</span>
            {comments.length > 0 && (
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm">
                {comments.length}
              </span>
            )}
          </div>
          {showComments ? (
            <ChevronUp className="w-5 h-5 text-purple-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-600" />
          )}
        </button>

        {showComments && (
          <div className="mt-4">
            <CommentForm productId={productId} />

            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            ) : comments.length > 0 ? (
              <CommentList comments={comments} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
