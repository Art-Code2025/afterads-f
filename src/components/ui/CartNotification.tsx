import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, ArrowRight, Eye } from 'lucide-react';
import { buildImageUrl } from '../../config/api';
import CheckoutAuthModal from '../modals/CheckoutAuthModal';
import { smartToast } from '../../utils/toastConfig';

interface CartNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  product?: {
    name: string;
    image: string;
    price: number;
    addOns?: Array<{ name: string; price: number; description?: string }>;
    selectedOptions?: Record<string, string>;
    totalPrice?: number;
  };
  quantity?: number;
}

const CartNotification: React.FC<CartNotificationProps> = ({ 
  isVisible, 
  onClose, 
  product, 
  quantity = 1 
}) => {
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [showCheckoutAuthModal, setShowCheckoutAuthModal] = useState(false);

  // Load cart count
  useEffect(() => {
    if (isVisible) {
      try {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
          }
        }
      } catch (error) {
        console.error('Error loading cart count:', error);
      }
    }
  }, [isVisible]);

  // Auto close after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    if (cartItemsCount === 0) {
      smartToast.frontend.error('سلة التسوق فارغة!');
      return;
    }
    setShowCheckoutAuthModal(true);
  };

  if (!isVisible || !product) return null;

  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 max-w-xs sm:max-w-sm w-full px-2 sm:px-0">
      <div 
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 transform transition-all duration-500 ease-out"
        style={{
          animation: isVisible ? 'slideInRight 0.5s ease-out' : 'slideOutRight 0.3s ease-in'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#18b5d5] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-white font-medium text-xs sm:text-sm">
              <span className="hidden sm:inline">تم إضافة المنتج للسلة!</span>
              <span className="sm:hidden">تم الإضافة!</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
            <img
              src={buildImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/logo.png';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-xs sm:text-sm font-bold truncate mb-1">
              {product.name}
            </h4>
            <div className="flex items-center gap-1 sm:gap-2 text-xs mb-2">
              <span className="text-[#ffffff] font-medium bg-[#18b5d5] px-1 sm:px-2 py-1 rounded text-xs">{quantity}</span>
              <span className="text-white/50 hidden sm:inline">•</span>
              <span className="text-[#ffffff] font-bold bg-[#18b5d5] px-1 sm:px-2 py-1 rounded text-xs">
                {(product.totalPrice || product.price).toLocaleString()} ر.س
              </span>
            </div>
            
            {/* Selected Options */}
            {product.selectedOptions && Object.keys(product.selectedOptions).length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-gray-300 mb-1">
                  <span className="hidden sm:inline">الخيارات المختارة:</span>
                  <span className="sm:hidden">خيارات:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(product.selectedOptions).slice(0, 1).map(([key, value]) => (
                    <span key={key} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-200 truncate">
                      {key}: {value}
                    </span>
                  ))}
                  {Object.keys(product.selectedOptions).length > 1 && (
                    <span className="text-xs text-gray-400">+{Object.keys(product.selectedOptions).length - 1} أخرى</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Add-ons */}
            {product.addOns && product.addOns.length > 0 && (
              <div className="text-xs text-white/70">
                <span className="font-medium hidden sm:inline">الإضافات: </span>
                <span className="font-medium sm:hidden">إضافات: </span>
                {product.addOns.slice(0, 1).map((addon, index) => (
                  <span key={index} className="truncate">
                    {addon.name} (+{addon.price})
                  </span>
                ))}
                {product.addOns.length > 1 && (
                  <span className="text-white/50"> +{product.addOns.length - 1}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4 border border-white/10">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-white/70">إجمالي المنتجات في السلة:</span>
            <span className="text-[#18b5d8] font-bold">{cartItemsCount} منتج</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleViewCart}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 border border-white/20 hover:border-white/30"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">عرض السلة</span>
            <span className="sm:hidden">السلة</span>
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] hover:from-[#16a2c7] hover:to-[#18b5d8] text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">إتمام الشراء</span>
            <span className="sm:hidden">طلب</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
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

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CartNotification;