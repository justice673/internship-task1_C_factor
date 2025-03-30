// src/types/index.ts
export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER' | 'MANAGER';
    permissions: string[];
    lastLogin?: Date;
    isActive: boolean;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'ADMIN' | 'USER' | 'MANAGER';
      permissions: string[];
      isActive: boolean; 
      lastLogin: Date;
    };
  }
  
  // Existing types
  export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
      likes: number;
      dislikes: number;
    };
  }
  
  export interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
      id: number;
      username: string;
    };
  }
  
  export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  }
  
  export interface DashboardStats {
    totalPosts: number;
    totalProducts: number;
    totalComments: number;
    totalRevenue: number;
  }