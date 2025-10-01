import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { smartToast } from '../../utils/toastConfig';
import { buildImageUrl, apiCall, API_ENDPOINTS } from '../../config/api';
import CheckoutAuthModal from '../modals/CheckoutAuthModal';

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

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onHoverChange?: (isHovered: boolean) => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, onHoverChange }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCheckoutAuthModal, setShowCheckoutAuthModal] = useState(false);
  const navigate = useNavigate();

  // Load cart from server for logged users, fallback to localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log('🛒 [CartDropdown] Loading cart...');
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('👤 [CartDropdown] User found, fetching cart from server for user:', user.id);
          
          try {
            const data = await apiCall(API_ENDPOINTS.USER_CART(user.id));
            console.log('📡 [CartDropdown] Server response:', data);
            
            let cartToLoad = [];
            if (Array.isArray(data) && data.length > 0) {
              cartToLoad = data;
              console.log('✅ [CartDropdown] Using server cart (array format):', cartToLoad.length, 'items');
            } else if (data && data.cart && Array.isArray(data.cart) && data.cart.length > 0) {
              cartToLoad = data.cart;
              console.log('✅ [CartDropdown] Using server cart (object format):', cartToLoad.length, 'items');
            } else {
              console.log('📭 [CartDropdown] Server cart is empty, checking localStorage');
            }
            
            if (cartToLoad.length > 0) {
              setCartItems(cartToLoad);
              // Sync localStorage with server cart
              localStorage.setItem('cart', JSON.stringify(cartToLoad));
              console.log('🔄 [CartDropdown] localStorage synced with server cart');
              return;
            }
          } catch (serverError) {
            console.error('❌ [CartDropdown] Server error, falling back to localStorage:', serverError);
          }
        } else {
          console.log('👤 [CartDropdown] No user found, loading from localStorage');
        }
        
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          console.log('💾 [CartDropdown] Loaded from localStorage:', parsedCart.length, 'items');
        } else {
          console.log('📭 [CartDropdown] No cart found in localStorage');
        }
      } catch (error) {
        console.error('❌ [CartDropdown] Error loading cart:', error);
      }
    };

    // Only load cart when dropdown becomes open for the first time or when cart is empty
    if (isOpen && cartItems.length === 0) {
      loadCart();
    }

    // Listen for cart updates but don't reload entire cart
    const handleCartUpdate = () => {
      // Only reload if cart is empty, otherwise trust local state
      if (cartItems.length === 0) {
        loadCart();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCountChanged', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCountChanged', handleCartUpdate);
    };
  }, [isOpen]);

  // Update quantity
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.id) {
          console.log('🔄 [CartDropdown] Updating quantity on server for user:', user.id, 'item:', itemId, 'quantity:', newQuantity);
          
          // Update quantity on server
          await apiCall(API_ENDPOINTS.CART_ITEM(user.id, itemId), {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQuantity })
          });
          
          console.log('✅ [CartDropdown] Successfully updated quantity on server');
        }
      }
      
      // Update local state and localStorage
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new CustomEvent('cartCountChanged'));
    } catch (error) {
      console.error('❌ [CartDropdown] Error updating quantity:', error);
      
      // Still update locally even if server update fails
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new CustomEvent('cartCountChanged'));
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId: number) => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.id) {
          console.log('🗑️ [CartDropdown] Removing item from server for user:', user.id, 'item:', itemId);
          
          // Delete from server
          await apiCall(API_ENDPOINTS.CART_ITEM(user.id, itemId), {
            method: 'DELETE'
          });
          
          console.log('✅ [CartDropdown] Successfully removed item from server');
        }
      }
      
      // Update local state and localStorage
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new CustomEvent('cartCountChanged'));
      smartToast.frontend.success('تم حذف المنتج من السلة');
    } catch (error) {
      console.error('❌ [CartDropdown] Error removing item:', error);
      
      // Still remove locally even if server removal fails
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new CustomEvent('cartCountChanged'));
      smartToast.frontend.success('تم حذف المنتج من السلة');
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // حساب السعر الأساسي
      const basePrice = item.basePrice || item.product.price;
      
      // حساب سعر الخيارات
      const optionsPrice = item.optionsPricing ? 
        Object.values(item.optionsPricing).reduce((sum, price) => sum + (price || 0), 0) : 0;
      
      // حساب سعر الخدمات الإضافية
      const addOnsPrice = item.addOnsPrice || 0;
      
      // استخدام totalPrice إذا كان متوفراً وأكبر من 0، وإلا احسب السعر
      const itemPrice = (item.totalPrice && item.totalPrice > 0) ? 
        item.totalPrice : (basePrice + optionsPrice + addOnsPrice);
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      smartToast.frontend.error('سلة التسوق فارغة!');
      return;
    }
    setShowCheckoutAuthModal(true);
  };

  // Handle view cart
  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="relative w-64 xs:w-72 sm:w-96 md:w-80 lg:w-96 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50 max-h-[60vh] xs:max-h-[65vh] sm:max-h-[80vh] overflow-hidden"
        style={{
          background: 'rgba(41, 41, 41, 0.85)',
          backdropFilter: 'blur(16px) saturate(150%)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%)',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          onHoverChange?.(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHoverChange?.(false);
          // تأخير إغلاق البوب أب لتجنب الاختفاء السريع
          setTimeout(() => {
            if (!isHovered) {
              onClose();
            }
          }, 300);
        }}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#18b5d8]" />
              <span className="hidden xs:inline">سلة التسوق</span>
              <span className="xs:hidden">السلة</span>
            </h3>
            <span className="text-xs sm:text-sm text-white/70">
              {cartItems.length} منتج
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="max-h-40 xs:max-h-48 sm:max-h-64 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="p-3 xs:p-4 sm:p-6 text-center">
              <Package className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-white/30 mx-auto mb-2 sm:mb-3" />
              <p className="text-white/70 mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base">السلة فارغة</p>
              <button
                onClick={onClose}
                className="text-[#18b5d8] hover:text-[#16a2c7] transition-colors text-sm sm:text-base"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="p-1 xs:p-1 sm:p-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-1 xs:gap-2 sm:gap-3 p-1.5 xs:p-2 sm:p-3 hover:bg-white/5 rounded-lg xs:rounded-xl transition-colors">
                  {/* Product Image */}
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-md xs:rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                    <img
                      src={buildImageUrl(item.product.mainImage)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logo.png';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-xs sm:text-sm font-medium truncate">
                      {item.product.name}
                    </h4>
                    
                    {/* Selected Options */}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="mt-1">
                        {Object.entries(item.selectedOptions).slice(0, 1).map(([key, value]) => (
                          <div key={key} className="text-xs text-gray-300">
                            <span className="text-gray-400">{key}:</span> <span className="text-[#18b5d8]">{value}</span>
                          </div>
                        ))}
                        {Object.keys(item.selectedOptions).length > 1 && (
                          <div className="text-xs text-gray-400">+{Object.keys(item.selectedOptions).length - 1} خيارات أخرى</div>
                        )}
                      </div>
                    )}
                    
                    {/* Add-ons - الخدمات الإضافية المختارة */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="mt-1 sm:mt-2 p-1 sm:p-2 bg-[#18b5d5]-100/10 rounded border border-green-500/20">
                        <div className="text-xs text-[#18b5d5] font-medium mb-1 flex items-center gap-1">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#18b5d5] rounded-full"></span>
                          <span className="hidden sm:inline">الخدمات المضافة:</span>
                          <span className="sm:hidden">خدمات:</span>
                        </div>
                        <div className="space-y-1">
                          {item.addOns.slice(0, 1).map((addon, index) => (
                            <div key={index} className="text-xs text-gray-200 flex justify-between items-center bg-white/5 rounded px-1 sm:px-2 py-1">
                              <span className="flex items-center gap-1 truncate">
                                <span className="text-[#18b5d5] text-xs">✓</span>
                                <span className="truncate">{addon.name}</span>
                              </span>
                              <span className="text-[#18b5d8] font-bold text-xs">+{addon.price}</span>
                            </div>
                          ))}
                        </div>
                        {item.addOns.length > 1 && (
                          <div className="text-xs text-green-300 mt-1 text-center">+{item.addOns.length - 1} أخرى</div>
                        )}
                      </div>
                    )}
                    
                    {/* Additional Services from product - الخدمات المتاحة للإضافة */}
                    {item.product.additionalServices && item.product.additionalServices.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          خدمات متاحة للإضافة:
                        </div>
                        <div className="space-y-1">
                          {item.product.additionalServices.slice(0, 2).map((service, index) => (
                            <div key={index} className="text-xs text-gray-200 flex justify-between items-center bg-white/5 rounded px-2 py-1">
                              <span className="flex items-center gap-1">
                                <span className="text-blue-400 text-xs">+</span>
                                {service.name}
                              </span>
                              <span className="text-[#18b5d8] font-medium">{service.price} ر.س</span>
                            </div>
                          ))}
                        </div>
                        {item.product.additionalServices.length > 2 && (
                          <div className="text-xs text-blue-300 mt-1 text-center">+{item.product.additionalServices.length - 2} خدمات أخرى</div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-[#18b5d8] text-xs sm:text-sm font-bold mt-1">
                      {(() => {
                        const basePrice = item.basePrice || item.product.price;
                        const optionsPrice = item.optionsPricing ? 
                          Object.values(item.optionsPricing).reduce((sum, price) => sum + (price || 0), 0) : 0;
                        const addOnsPrice = item.addOnsPrice || 0;
                        const itemPrice = (item.totalPrice && item.totalPrice > 0) ? 
                          item.totalPrice : (basePrice + optionsPrice + addOnsPrice);
                        return itemPrice.toLocaleString();
                      })()} ر.س
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-0.5 xs:gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <Minus className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                    </button>
                    <span className="w-5 xs:w-6 sm:w-8 text-center text-white text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <Plus className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-colors"
                  >
                    <Trash2 className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-2 xs:p-3 sm:p-4 border-t border-white/10">
            {/* Total */}
            <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
              <span className="text-white font-medium text-sm sm:text-base">الإجمالي:</span>
              <span className="text-[#18b5d8] font-bold text-base sm:text-lg">
                {calculateTotal().toLocaleString()} ر.س
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 xs:gap-2">
              <button
                onClick={handleViewCart}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-2 sm:px-4 rounded-xl transition-colors text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">عرض السلة</span>
                <span className="sm:hidden">السلة</span>
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] hover:from-[#16a2c7] hover:to-[#18b5d8] text-white py-2 px-2 sm:px-4 rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2"
              >
                <span className="hidden sm:inline">إتمام الشراء</span>
                <span className="sm:hidden">شراء</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Checkout Auth Modal */}
      {showCheckoutAuthModal && (
        <CheckoutAuthModal
          isOpen={showCheckoutAuthModal}
          onClose={() => setShowCheckoutAuthModal(false)}
          onContinueAsGuest={() => {
            setShowCheckoutAuthModal(false);
            onClose();
            navigate('/checkout');
          }}
          onLoginSuccess={() => {
            setShowCheckoutAuthModal(false);
            onClose();
            navigate('/checkout');
          }}
        />
      )}
    </>
  );
};

export default CartDropdown;