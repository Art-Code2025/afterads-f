import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import CartDropdown from './CartDropdown';
import { apiCall, API_ENDPOINTS } from '../../config/api';

const FloatingCartButton: React.FC = () => {
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on certain pages
  const hiddenPaths = ['/cart', '/checkout', '/login', '/admin'];
  const shouldHide = hiddenPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  // Load cart count from server for logged users, fallback to localStorage
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        console.log('🔢 [FloatingCartButton] Updating cart count...');
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('👤 [FloatingCartButton] User found, fetching cart from server for user:', user.id);
          
          try {
            const data = await apiCall(API_ENDPOINTS.USER_CART(user.id));
            console.log('📡 [FloatingCartButton] Server response:', data);
            
            let cartItems = [];
            if (Array.isArray(data) && data.length > 0) {
              cartItems = data;
              console.log('✅ [FloatingCartButton] Using server cart (array format):', cartItems.length, 'items');
            } else if (data && data.cart && Array.isArray(data.cart) && data.cart.length > 0) {
              cartItems = data.cart;
              console.log('✅ [FloatingCartButton] Using server cart (object format):', cartItems.length, 'items');
            } else {
              console.log('📭 [FloatingCartButton] Server cart is empty, checking localStorage');
            }
            
            if (cartItems.length > 0) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              // Sync localStorage with server cart
              localStorage.setItem('cart', JSON.stringify(cartItems));
              console.log('🔄 [FloatingCartButton] localStorage synced with server cart, count:', totalItems);
              return;
            }
          } catch (serverError) {
            console.error('❌ [FloatingCartButton] Server error, falling back to localStorage:', serverError);
          }
        } else {
          console.log('👤 [FloatingCartButton] No user found, loading from localStorage');
        }
        
        // Fallback to localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
            console.log('💾 [FloatingCartButton] Loaded from localStorage, count:', totalItems);
          }
        } else {
          setCartItemsCount(0);
          console.log('📭 [FloatingCartButton] No cart found, count: 0');
        }
      } catch (error) {
        console.error('❌ [FloatingCartButton] Error loading cart count:', error);
        setCartItemsCount(0);
      }
    };

    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => updateCartCount();
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartCountChanged', handleCartUpdate);
    window.addEventListener('productAddedToCart', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartCountChanged', handleCartUpdate);
      window.removeEventListener('productAddedToCart', handleCartUpdate);
    };
  }, []);

  // Hide/show based on scroll (optional)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down fast
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 10) {
        setIsVisible(false);
        setIsCartDropdownOpen(false); // Close dropdown when hiding
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if should be hidden or no items in cart
  if (shouldHide || cartItemsCount === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div 
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        } lg:hidden`} // Only show on mobile/tablet
      >
        <div className="relative">
          <button
            onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
            className="bg-gradient-to-r from-[#18b5d8] to-[#16a2c7] hover:from-[#16a2c7] hover:to-[#18b5d8] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
            style={{
              boxShadow: '0 8px 32px rgba(24, 181, 216, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <ShoppingCart className="w-6 h-6" />
            
            {/* Cart Count Badge */}
            <span 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[24px] h-[24px] flex items-center justify-center text-xs font-bold shadow-lg animate-pulse"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(239, 68, 68, 1))',
                animationDuration: '2s'
              }}
            >
              {cartItemsCount}
            </span>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
          </button>
          
          {/* Dropdown positioned above the button */}
          {isCartDropdownOpen && (
            <div 
              className="absolute bottom-full right-0 mb-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                // تأخير إغلاق البوب أب لمنع الاختفاء السريع
                setTimeout(() => {
                  if (!isHovered) {
                    setIsCartDropdownOpen(false);
                  }
                }, 200);
              }}
            >
              <CartDropdown 
                isOpen={isCartDropdownOpen} 
                onClose={() => setIsCartDropdownOpen(false)}
                onHoverChange={(hovered) => setIsHovered(hovered)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop for mobile dropdown */}
      {isCartDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCartDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingCartButton;