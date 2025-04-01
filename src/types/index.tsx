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
  
  export interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
      id: number;
      username: string;
    };
    isLocal?: boolean;
  }
  
  
  export interface DashboardStats {
    totalPosts: number;
    totalProducts: number;
    totalComments: number;
    totalRevenue: number;
  }
  
  //this is the type for the posts

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
    isLocal?: boolean;
  }

  export interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Omit<Post, 'id'> | Post) => void;
    initialData?: Post;
    mode: 'add' | 'edit';
  }
  
  export interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
  }
  
  export interface PostCardProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (id: number) => void;
  }
  

  //this is the type for the products

   
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
    isLocal?: boolean;
  }

  export interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'> | Product) => void;
    initialData?: Product;
    mode: 'add' | 'edit';
}

  export interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}
