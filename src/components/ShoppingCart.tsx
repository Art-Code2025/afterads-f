import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smartToast } from '../utils/toastConfig';
import { ShoppingCart as CartIcon, Plus, Minus, Trash2, Package, ArrowRight } from 'lucide-react';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../config/api';
import AuthModal from './modals/AuthModal';
import CheckoutAuthModal from './modals/CheckoutAuthModal';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  optionsPricing?: Record<string, number>;
  attachments?: {
    images?: string[];
    text?: string;
  };
  addOns?: Array<{ name: string; price: number; description?: string }>;
  totalPrice?: number;
  basePrice?: number;
  addOnsPrice?: number;
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    mainImage: string;
    detailedImages?: string[];
    isAvailable: boolean;
    productType?: string;
    additionalServices?: Array<{
      name: string;
      price: number;
      description?: string;
    }>;
  };
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutAuthModal, setShowCheckoutAuthModal] = useState(false);
  const navigate = useNavigate();

  // Load cart from server for logged users, fallback to localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        let cartToLoad = [];
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user?.id) {
              console.log('🔄 [ShoppingCart] User is logged in, loading cart from server:', user.id);
              
              // Load cart from server for logged users
              const serverCart = await apiCall(API_ENDPOINTS.USER_CART(user.id));
              
              if (Array.isArray(serverCart)) {
                cartToLoad = serverCart;
                console.log('✅ [ShoppingCart] Loaded cart from server:', cartToLoad.length, 'items');
              } else if (serverCart && typeof serverCart === 'object' && serverCart.cart && Array.isArray(serverCart.cart)) {
                cartToLoad = serverCart.cart;
                console.log('✅ [ShoppingCart] Loaded cart from server (cart property):', cartToLoad.length, 'items');
              } else {
                console.warn('⚠️ [ShoppingCart] Server returned unexpected cart format, falling back to local storage');
                throw new Error('Invalid server cart format');
              }
              
              // Update local storage with server cart
              localStorage.setItem('cart', JSON.stringify(cartToLoad));
              console.log('✅ [ShoppingCart] Local storage synced with server cart');
              
              // Dispatch cart update event
              window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
          } catch (serverError) {
            console.error('❌ [ShoppingCart] Error loading cart from server, falling back to local storage:', serverError);
            // Fallback to local storage if server fails
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              cartToLoad = JSON.parse(savedCart);
            }
          }
        } else {
          console.log('👤 [ShoppingCart] User not logged in, loading from local storage');
          // Load from local storage for non-logged users
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            cartToLoad = JSON.parse(savedCart);
          }
        }
        
        setCartItems(cartToLoad);
      } catch (error) {
        console.error('Error loading cart:', error);
        smartToast.frontend.error('فشل في تحميل السلة');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage
  const saveCartToLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      smartToast.frontend.error('فشل في حفظ السلة');
    }
  }, []);

  // Update quantity
  const updateQuantity = useCallback(
    async (itemId: number, newQuantity: number) => {
      if (newQuantity < 1) return;

      try {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const user = JSON.parse(userData);
          if (user?.id) {
            console.log('🔄 [ShoppingCart] Updating quantity on server for user:', user.id, 'item:', itemId, 'quantity:', newQuantity);
            
            // Update quantity on server
            await apiCall(API_ENDPOINTS.CART_ITEM(user.id, itemId), {
              method: 'PUT',
              body: JSON.stringify({ quantity: newQuantity })
            });
             
            console.log('✅ [ShoppingCart] Successfully updated quantity on server');
          }
        }
        
        // Update local state and localStorage
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
        window.dispatchEvent(new Event('cartUpdated'));
        smartToast.frontend.success('تم تحديث الكمية');
      } catch (error) {
        console.error('❌ [ShoppingCart] Error updating quantity:', error);
        
        // Still update locally even if server update fails
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
        window.dispatchEvent(new Event('cartUpdated'));
        
        smartToast.frontend.error('تم تحديث الكمية محلياً، لكن فشل في حفظها على الخادم');
      }
    },
    [cartItems, saveCartToLocalStorage]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: number) => {
      try {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const user = JSON.parse(userData);
          if (user?.id) {
            console.log('🗑️ [ShoppingCart] Removing item from server for user:', user.id, 'item:', itemId);
            
            // Delete from server
            await apiCall(API_ENDPOINTS.CART_ITEM(user.id, itemId), {
              method: 'DELETE'
            });
            
            console.log('✅ [ShoppingCart] Successfully removed item from server');
          }
        }
        
        // Update local state and localStorage
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('cartCountChanged', { detail: { count: updatedItems.length } }));
        smartToast.frontend.success('تم حذف المنتج من السلة');
      } catch (error) {
        console.error('❌ [ShoppingCart] Error removing item:', error);
        
        // Still remove locally even if server removal fails
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        saveCartToLocalStorage(updatedItems);
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('cartCountChanged', { detail: { count: updatedItems.length } }));
        
        smartToast.frontend.error('تم حذف المنتج محلياً، لكن فشل في حذفه من الخادم');
      }
    },
    [cartItems, saveCartToLocalStorage]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setCartItems([]);
      saveCartToLocalStorage([]);

      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.id) {
            await apiCall(API_ENDPOINTS.USER_CART(user.id), { method: 'DELETE' });
            localStorage.setItem(`cartCount_${user.id}`, '0');
          }
        } catch (error) {
          console.error('Error clearing server cart:', error);
        }
      }

      localStorage.setItem('lastCartCount', '0');
      localStorage.removeItem('cart');

      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('cartCountChanged'));
      window.dispatchEvent(new Event('forceCartUpdate'));
      window.dispatchEvent(new CustomEvent('cartCleared', { detail: { count: 0 } }));

      document.querySelectorAll('[data-cart-count]').forEach((element) => {
        if (element instanceof HTMLElement) {
          element.textContent = '0';
          element.style.display = 'none';
        }
      });

      smartToast.frontend.success('تم إفراغ السلة بالكامل');
    } catch (error) {
      console.error('Error clearing cart:', error);
      smartToast.frontend.error('حدث خطأ أثناء إفراغ السلة');
    }
  }, [saveCartToLocalStorage]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.basePrice || item.product.price;
      const addOnsPrice = item.addOnsPrice || 0;
      const optionsPrice = item.optionsPricing ? 
        Object.values(item.optionsPricing).reduce((sum, price) => sum + (price || 0), 0) : 0;
      const itemTotal = (basePrice + addOnsPrice + optionsPrice) * item.quantity;
      return total + itemTotal;
    }, 0);
  }, [cartItems]);

  const total = subtotal;

  // Proceed to checkout
  const proceedToCheckout = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setShowCheckoutAuthModal(true);
      return;
    }
    navigate('/checkout');
  };

  // Filter cart items (no search, but keeping filteredCartItems for consistency)
  const filteredCartItems = cartItems;

  return (
    <section className="min-h-screen bg-[#292929] relative overflow-hidden overflow-x-hidden" dir="rtl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8] via-transparent to-[#16a2c7]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #18b5d8 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #16a2c7 0%, transparent 50%)`,
          backgroundSize: '100px 100px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(24, 181, 216, 0.3)); transform: scale(1); }
            50% { filter: drop-shadow(0 0 10px rgba(24, 181, 216, 0.7)); transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          @media (max-width: 640px) {
            .animate-pulse:not(.essential) { animation: none; }
          }
        `}
      </style>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-16 mt-[60px] sm:mt-[80px]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#16a2c7]/30 blur-sm transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/20 to-[#16a2c7]/10 backdrop-blur-md border border-[#18b5d8]/30 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#18b5d8]/15 to-transparent transition-all duration-700" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <CartIcon className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6 text-[#18b5d8] animate-[glow_3.5s_ease-in-out_infinite]" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white">
              سلة التسوق <span className="text-[#18b5d8]">الخاصة بك</span>
            </h1>
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#16a2c7]/30 blur-sm transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/20 to-[#16a2c7]/10 backdrop-blur-md border border-[#18b5d8]/30 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#18b5d8]/15 to-transparent transition-all duration-700" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <CartIcon className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6 text-[#18b5d8] animate-[glow_3.5s_ease-in-out_infinite]" />
            </div>
          </div>
          <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-4">
            راجع منتجاتك المختارة وتابع إلى الدفع بسهولة
          </p>
        </div>

        {/* Clear Cart Button */}
        {cartItems.length > 0 && (
          <div className="relative flex mb-6 sm:mb-12 justify-center">
            <button
              onClick={clearCart}
              className="relative flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-sm sm:text-base"
              aria-label="إفراغ سلة التسوق"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              إفراغ السلة
            </button>
          </div>
        )}

        {/* Loading State */}
        {isInitialLoading && (
          <div className="text-center py-16">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#16a2c7]/30 blur-sm transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/20 to-[#16a2c7]/10 backdrop-blur-md border border-[#18b5d8]/30 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#18b5d8]/15 to-transparent transition-all duration-700" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18b5d8]"></div>
              </div>
            </div>
            <p className="text-white text-lg font-bold">جاري تحميل السلة...</p>
          </div>
        )}

        {/* Empty Cart State */}
        {!isInitialLoading && filteredCartItems.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#16a2c7]/30 blur-sm transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/20 to-[#16a2c7]/10 backdrop-blur-md border border-[#18b5d8]/30 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-2 bg-gradient-to-br from-[#18b5d8]/15 to-transparent transition-all duration-700" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CartIcon className="w-10 h-10 text-[#18b5d8] animate-[glow_3.5s_ease-in-out_infinite]" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-4">سلة التسوق فارغة</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
              لم تقم بإضافة أي منتجات إلى السلة بعد.
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <Link
                to="/products"
                className="block w-full bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] text-white px-8 py-4 rounded-2xl hover:from-[#16a2c7] hover:to-[#18b5d8] transition-all duration-300 font-black text-lg backdrop-blur-sm border border-white/20 hover:scale-105 transform shadow-xl"
                aria-label="تصفح المنتجات"
              >
                تصفح الخدمات
              </Link>
              <Link
                to="/"
                className="block w-full bg-white/10 backdrop-blur-xl border border-[#18b5d8]/50 text-white px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 font-black text-lg hover:scale-105 transform shadow-xl"
                aria-label="العودة للرئيسية"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        )}

        {/* Cart Items and Order Summary */}
        {!isInitialLoading && filteredCartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-10 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-10">
              {filteredCartItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden group hover:border-[#18b5d8]/50 hover:shadow-[0_0_20px_rgba(24,181,216,0.5)] transition-all duration-500 transform hover:-translate-y-1 relative"
                >
                  {/* Decorative Circle */}
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 p-4 sm:p-8 relative z-10">
                    {/* Product Image */}
                    <div className="md:col-span-1 order-1 relative">
                      <img
                        src={buildImageUrl(item.product.mainImage)}
                        alt={item.product.name}
                        loading="lazy"
                        className="w-full h-32 sm:h-48 object-cover rounded-xl sm:rounded-2xl border-2 border-[#18b5d8]/40 shadow-lg group-hover:border-[#18b5d8] transition-all duration-300 transform hover:scale-105"
                        onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-2 order-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2 line-clamp-2 hover:text-[#18b5d8] transition-colors duration-300">
                          {item.product.name}
                        </h3>
                        {item.product.description && (
                          <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{item.product.description}</p>
                        )}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <span className="text-lg sm:text-2xl font-black text-[#18b5d8]">
                            {item.totalPrice ? (item.totalPrice * item.quantity).toLocaleString() : (item.product.price * item.quantity).toLocaleString()} ر.س
                          </span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                              {(item.product.originalPrice * item.quantity).toLocaleString()} ر.س
                            </span>
                          )}
                        </div>
                        
                        {/* Display selected add-ons */}
                        {item.addOns && Array.isArray(item.addOns) && item.addOns.length > 0 && (
                          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl border border-[#18b5d8]/30">
                            <h4 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                              الخدمات الإضافية:
                            </h4>
                            <div className="space-y-1 sm:space-y-2">
                              {item.addOns.map((addOn: any, index: number) => (
                                <div key={index} className="flex justify-between items-center text-xs sm:text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-gray-300">{addOn.name}</span>
                                    {addOn.description && (
                                      <span className="text-xs text-gray-400">{addOn.description}</span>
                                    )}
                                  </div>
                                  <span className="text-[#18b5d8] font-bold">{addOn.price.toLocaleString()} ر.س</span>
                                </div>
                              ))}
                            </div>
                            {item.basePrice && item.addOnsPrice && (
                              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/20">
                                <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                                  <span className="text-gray-300">السعر الأساسي:</span>
                                  <span className="text-white font-medium">{item.basePrice.toLocaleString()} ر.س</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                  <span className="text-gray-300">سعر الخدمات الإضافية:</span>
                                  <span className="text-[#18b5d8] font-bold">{item.addOnsPrice.toLocaleString()} ر.س</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 sm:gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-white font-bold text-sm sm:text-base">الكمية:</span>
                          <div className="flex items-center bg-[#18b5d8]/10 rounded-lg sm:rounded-xl overflow-hidden border border-[#18b5d8]/30">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 sm:p-2 hover:bg-[#18b5d8]/30 transition-colors text-white"
                              disabled={item.quantity <= 1}
                              aria-label={`تقليل كمية ${item.product.name}`}
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold min-w-[2rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 sm:p-2 hover:bg-[#18b5d8]/30 transition-colors text-white"
                              aria-label={`زيادة كمية ${item.product.name}`}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 sm:gap-2 text-red-400 hover:text-red-300 transition-colors font-bold text-sm sm:text-base"
                          aria-label={`حذف ${item.product.name} من السلة`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          حذف من السلة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden group hover:border-[#18b5d8]/50 hover:shadow-[0_0_20px_rgba(24,181,216,0.5)] transition-all duration-500 sticky top-20 sm:top-24 relative">
                {/* Decorative Circle */}
                <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-pulse"></div>
                <div className="bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] px-4 sm:px-6 py-3 sm:py-5 relative z-10">
                  <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-1 sm:gap-2">
                    <Package className="w-4 h-4 sm:w-6 sm:h-6" />
                    ملخص الطلب
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative z-10">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">المجموع الفرعي:</span>
                    <span className="font-black text-white text-base sm:text-lg">{subtotal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="border-t-2 border-[#18b5d8]/30 pt-3 sm:pt-4">
                    <div className="flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-[#18b5d8]/20 to-[#16a2c7]/20 rounded-xl sm:rounded-2xl border-2 border-[#18b5d8]/30">
                      <span className="font-black text-white text-lg sm:text-xl">المجموع الكلي:</span>
                      <div className="text-left">
                        <div className="text-2xl sm:text-3xl font-black text-[#18b5d8]">{total.toLocaleString()}</div>
                         <div className="text-[#18b5d8] text-xs sm:text-sm font-bold">ر.س</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-[#16a2c7] hover:to-[#18b5d8] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                    aria-label="متابعة إلى الدفع"
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    متابعة إلى الدفع
                  </button>
                  <Link
                    to="/products"
                    className="block w-full text-center mt-3 sm:mt-4 text-gray-300 hover:text-[#18b5d8] transition-colors font-bold text-sm sm:text-base"
                    aria-label="متابعة التسوق"
                  >
                    متابعة التسوق
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modals */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={() => {
              setShowAuthModal(false);
            }}
          />
        )}
        {showCheckoutAuthModal && (
          <CheckoutAuthModal
            isOpen={showCheckoutAuthModal}
            onClose={() => setShowCheckoutAuthModal(false)}
            onContinueAsGuest={() => {
              setShowCheckoutAuthModal(false);
              navigate('/checkout');
            }}
            onLoginSuccess={() => {
              setShowCheckoutAuthModal(false);
              navigate('/checkout');
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ShoppingCart;