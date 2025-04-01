// src/services/api.ts
import axios from 'axios';
import { Post, Comment as CommentType, Product } from '../types/index';

export type Comment = CommentType;
const BASE_URL = 'https://dummyjson.com';

interface PostResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}


interface CommentResponse {
  comments: CommentType[];
  total: number;
  skip: number;
  limit: number;
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface ProductComment extends CommentType {
  productId: number;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const api = {
  async getPosts(limit: number = 10, page: number = 1) {
    const response = await axios.get<PostResponse>(`${BASE_URL}/posts?limit=${limit}&page=${page}`);
    return response.data;
  },

  async getComments(limit: number = 10, page: number = 1) {
    const response = await axios.get<CommentResponse>(`${BASE_URL}/comments?limit=${limit}&page=${page}`);
    return response.data;
  },
  async deleteComment(id: number) {
    const response = await axios.delete(`${BASE_URL}/comments/${id}`);
    return response.data;
  },
  async deletePost(id: number): Promise<void> {
      return fetch(`/posts/${id}`, { method: 'DELETE' }).then((response) => {
          if (!response.ok) {
              throw new Error('Failed to delete post');
          }
      });
  }
};

export const productService = {
  async fetchProducts(page: number = 1, limit: number = 10): Promise<ProductResponse> {
    const skip = (page - 1) * limit;
    const response = await axios.get<ProductResponse>(
      `${BASE_URL}/products?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      // Use a simple check for response property
      const err = error as AxiosErrorResponse;
      if (err.response && err.response.data) {
        throw new Error(err.response.data.message || 'Failed to fetch product details');
      }
      throw error;
    }
  },

  async searchProducts(query: string): Promise<ProductResponse> {
    const response = await axios.get<ProductResponse>(
      `${BASE_URL}/products/search?q=${query}`
    );
    return response.data;
  },

   getStoredComments(): ProductComment[] {
    const stored = localStorage.getItem('productComments');
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        body: "This is a great product! Highly recommended.",
        productId: 1,
        postId: 1,
        user: {
          id: 1,
          username: "johndoe"
        }
      }
    ];
  },

  
   saveComments(comments: ProductComment[]) {
    localStorage.setItem('productComments', JSON.stringify(comments));
  },

  async getProductComments(productId: number): Promise<CommentType[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const comments = this.getStoredComments();
      return comments.filter(comment => comment.productId === productId);
    } catch (error) {
      throw new Error('Failed to fetch product comments');
    }
  },

  async addComment(productId: number, commentData: { body: string }): Promise<CommentType> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const comments = this.getStoredComments();
      const newComment: ProductComment = {
        id: comments.length + 1,
        body: commentData.body,
        productId: productId,
        postId: productId, 
        user: {
          id: Math.floor(Math.random() * 1000), 
          username: "currentUser" 
        }
      };

      comments.push(newComment);
      this.saveComments(comments);
      return newComment;
    } catch (error) {
      throw new Error('Failed to add comment');
    }
  },

  // Optional: Add a method to clear all comments (useful for testing)
  clearComments() {
    localStorage.removeItem('productComments');
  }
};