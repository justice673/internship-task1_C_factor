export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }
  
  export interface Cart {
    items: CartItem[];
    total: number;
  }
  
  export const cartService = {
    getCart(): Cart {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : { items: [], total: 0 };
    },
  
    saveCart(cart: Cart): void {
      localStorage.setItem('cart', JSON.stringify(cart));
    },
  
    addToCart(product: any, quantity: number = 1): Cart {
      const cart = this.getCart();
      const existingItem = cart.items.find(item => item.id === product.id);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          image: product.thumbnail
        });
      }
  
      cart.total = this.calculateTotal(cart.items);
      this.saveCart(cart);
      return cart;
    },
  
    removeFromCart(productId: number): Cart {
      const cart = this.getCart();
      cart.items = cart.items.filter(item => item.id !== productId);
      cart.total = this.calculateTotal(cart.items);
      this.saveCart(cart);
      return cart;
    },
  
    updateQuantity(productId: number, quantity: number): Cart {
      const cart = this.getCart();
      const item = cart.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          return this.removeFromCart(productId);
        }
        item.quantity = quantity;
        cart.total = this.calculateTotal(cart.items);
        this.saveCart(cart);
      }
      
      return cart;
    },
  
    clearCart(): Cart {
      const emptyCart = { items: [], total: 0 };
      this.saveCart(emptyCart);
      return emptyCart;
    },
  
     calculateTotal(items: CartItem[]): number {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
  };
  