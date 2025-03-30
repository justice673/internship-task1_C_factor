import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { ArrowLeft, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Input formatting based on field type
    switch (name) {
      case 'cardNumber':
        formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
        formattedValue = formattedValue.substring(0, 19);
        break;
      case 'expiryDate':
        formattedValue = value.replace(/\D/g, '')
          .replace(/^(\d{2})/, '$1/')
          .substring(0, 5);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
        break;
      case 'zipCode':
        formattedValue = value.replace(/\D/g, '').substring(0, 5);
        break;
      case 'email':
        formattedValue = value.toLowerCase();
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardNumberRegex = /^(\d{4}\s){3}\d{4}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const zipCodeRegex = /^\d{5}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.address || !formData.city || !formData.state) {
      toast.error('Please fill in all address fields');
      return false;
    }
    if (!zipCodeRegex.test(formData.zipCode)) {
      toast.error('Please enter a valid 5-digit ZIP code');
      return false;
    }
    if (!cardNumberRegex.test(formData.cardNumber)) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!expiryDateRegex.test(formData.expiryDate)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cvvRegex.test(formData.cvv)) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading('Processing your payment...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss(loadingToast);
      toast.success('Order placed successfully! Thank you for your purchase.');
      // Implement clearCart and navigation as needed
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
        <ShoppingBag className="w-16 h-16 text-purple-500" />
        <h2 className="text-2xl font-semibold text-purple-500 text-center">Your cart is empty</h2>
        <p className="text-gray-500 text-center">Add items to your cart to checkout</p>
        <Link 
          to="/shop"
          className="mt-4 px-6 py-2 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-purple-500 hover:underline"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-purple-500">Checkout</h1>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Payment Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-6 lg:mt-0">
            <div className="bg-white shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                type="submit"
                onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}
                className="w-full mt-6 px-6 py-3 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 font-medium"
              >
                Place Order
              </button>

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

export default CheckoutPage;