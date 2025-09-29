import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smartToast } from '../../utils/toastConfig';
import { Menu, X, ShoppingCart, Heart, User, LogOut, Search, Package, Settings, Phone, Mail, MapPin, Clock, ChevronDown, Home, Grid3X3, Star, Award, Truck, Shield, Sparkles, Bell, ChevronLeft, BookOpen } from 'lucide-react';
import logo from '../../assets/logo.webp';
import AuthModal from '../modals/AuthModal';
import CartDropdown from '../ui/CartDropdown';
import { createCategorySlug } from '../../utils/slugify';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../../config/api';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Control navbar visibility based on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // At top of page - show navbar, hide floating logo
        setScrolled(false);
        setShowNavbar(true);
      } else {
        // Scrolled down - mark as scrolled
        setScrolled(true);
        
        if (isLogoHovered) {
          // Logo is hovered - show navbar
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide navbar
          setShowNavbar(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          setShowNavbar(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    const throttledControlNavbar = throttle(controlNavbar, 10);
    window.addEventListener('scroll', throttledControlNavbar);

    return () => window.removeEventListener('scroll', throttledControlNavbar);
  }, [lastScrollY, isLogoHovered]);

  // Handle logo hover to show navbar
  useEffect(() => {
    if (isLogoHovered && scrolled) {
      setShowNavbar(true);
    }
  }, [isLogoHovered, scrolled]);

  // Close user menu and cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      // تحسين منطق إغلاق البوب أب - لا نغلقه إذا كان المستخدم يحوم عليه
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        // تأخير الإغلاق للسماح بالانتقال بين العناصر
        setTimeout(() => {
          if (!isCartHovered) {
            setIsCartDropdownOpen(false);
          }
        }, 400);
      }
    };

    if (isUserMenuOpen || isCartDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isCartDropdownOpen, isCartHovered]);

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    const handleMobileMenuClose = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is on the overlay (not on the menu panel)
      if (isMenuOpen && target.classList.contains('mobile-menu-overlay')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleMobileMenuClose);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleMobileMenuClose);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Hide navbar when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [isMenuOpen]);

  // Throttle function for better performance
  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: number | null = null;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('👤 User loaded from localStorage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
    fetchCategories();

    const handleCartUpdate = () => {
      console.log('🔄 [Navbar] Cart update event received');
      fetchCartCount();
    };

    const handleCartCountChange = () => {
      console.log('🔄 [Navbar] Cart count change event received');
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
            console.log('📊 [Navbar] Cart count updated instantly:', totalItems);
            const userData = localStorage.getItem('user');
            if (userData) {
              console.log('👤 [Navbar] Logged in user - syncing with server in background');
              setTimeout(() => fetchCartCount(), 100);
            }
            return;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing local cart:', parseError);
        }
      }
      const userData = localStorage.getItem('user');
      if (userData) {
        console.log('👤 [Navbar] No local cart - fetching from server');
        fetchCartCount();
      } else {
        setCartItemsCount(0);
      }
    };

    const handleWishlistUpdate = () => {
      console.log('🔄 [Navbar] Wishlist update event received');
      fetchWishlistCount();
    };

    const handleCategoriesUpdate = () => fetchCategories();

    const cartEvents = [
      'cartUpdated',
      'productAddedToCart',
      'forceCartUpdate'
    ];

    const cartCountEvents = [
      'cartCountChanged'
    ];

    const wishlistEvents = [
      'wishlistUpdated',
      'productAddedToWishlist',
      'productRemovedFromWishlist',
      'wishlistCleared'
    ];

    cartEvents.forEach(event => {
      window.addEventListener(event, handleCartUpdate);
    });

    cartCountEvents.forEach(event => {
      window.addEventListener(event, handleCartCountChange);
    });

    wishlistEvents.forEach(event => {
      window.addEventListener(event, handleWishlistUpdate);
    });

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartUpdated' || e.key === 'lastCartUpdate' || e.key === 'forceCartRefresh') {
        console.log('🔄 [Navbar] Storage cart update detected');
        handleCartUpdate();
      }
      if (e.key === 'wishlistUpdated' || e.key === 'lastWishlistUpdate') {
        console.log('🔄 [Navbar] Storage wishlist update detected');
        handleWishlistUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      const savedCartCount = localStorage.getItem(`cartCount_${user.id}`);
      const savedWishlistCount = localStorage.getItem(`wishlistCount_${user.id}`);

      if (savedCartCount) {
        setCartItemsCount(parseInt(savedCartCount));
      }
      if (savedWishlistCount) {
        setWishlistItemsCount(parseInt(savedWishlistCount));
      }
    } else {
      console.log('👤 [Navbar] Loading wishlist for guest user');
      const savedWishlist = localStorage.getItem('wishlist');
      console.log('💾 [Navbar] Guest wishlist from localStorage:', savedWishlist);

      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('📦 [Navbar] Parsed guest wishlist:', parsedWishlist);

          if (Array.isArray(parsedWishlist)) {
            console.log('✅ [Navbar] Setting guest wishlist count:', parsedWishlist.length);
            setWishlistItemsCount(parsedWishlist.length);
          } else {
            console.log('❌ [Navbar] Guest wishlist is not an array');
            setWishlistItemsCount(0);
          }
        } catch (error) {
          console.error('❌ [Navbar] Error parsing guest wishlist:', error);
          setWishlistItemsCount(0);
        }
      } else {
        console.log('📭 [Navbar] No guest wishlist found, setting count to 0');
        setWishlistItemsCount(0);
      }
    }

    return () => {
      cartEvents.forEach(event => {
        window.removeEventListener(event, handleCartUpdate);
      });

      cartCountEvents.forEach(event => {
        window.removeEventListener(event, handleCartCountChange);
      });

      wishlistEvents.forEach(event => {
        window.removeEventListener(event, handleWishlistUpdate);
      });

      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const userData = localStorage.getItem('user');

      if (!userData) {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              console.log('📊 [Navbar] Cart count from localStorage:', totalItems);
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart:', parseError);
          }
        }
        setCartItemsCount(0);
        localStorage.setItem('lastCartCount', '0');
        console.log('📊 [Navbar] No user and no local cart, setting count to 0');
        return;
      }

      const user = JSON.parse(userData);
      if (!user?.id) {
        console.warn('⚠️ [Navbar] Invalid user data, falling back to localStorage');
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart fallback:', parseError);
          }
        }
        setCartItemsCount(0);
        localStorage.setItem('lastCartCount', '0');
        return;
      }

      console.log('🔄 [Navbar] Fetching cart count for user:', user.id);

      try {
        const data = await apiCall(API_ENDPOINTS.USER_CART(user.id));
        console.log('📦 [Navbar] Raw cart data:', data);

        let totalItems = 0;
        if (Array.isArray(data)) {
          totalItems = data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        } else if (data && typeof data === 'object' && Array.isArray(data.cart)) {
          totalItems = data.cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        } else if (data && typeof data === 'object' && typeof data.totalItems === 'number') {
          totalItems = data.totalItems;
        }

        console.log('📊 [Navbar] Cart count calculated from server:', totalItems);
        setCartItemsCount(totalItems);

        localStorage.setItem('lastCartCount', totalItems.toString());
        localStorage.setItem(`cartCount_${user.id}`, totalItems.toString());

        console.log('💾 [Navbar] Cart count saved to localStorage:', totalItems);
      } catch (apiError) {
        console.error('❌ [Navbar] API error, falling back to localStorage:', apiError);

        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              console.log('📊 [Navbar] Cart count from localStorage fallback:', totalItems);
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart in API fallback:', parseError);
          }
        }

        const lastCount = localStorage.getItem('lastCartCount');
        if (lastCount) {
          const count = parseInt(lastCount, 10) || 0;
          setCartItemsCount(count);
          console.log('📊 [Navbar] Using last saved cart count:', count);
        } else {
          setCartItemsCount(0);
          localStorage.setItem('lastCartCount', '0');
          console.log('📊 [Navbar] No fallback available, setting count to 0');
        }
      }
    } catch (error) {
      console.error('❌ [Navbar] Error fetching cart count:', error);

      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
            return;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing local cart fallback:', parseError);
        }
      }

      setCartItemsCount(0);
      localStorage.setItem('lastCartCount', '0');
    }
  };

  const fetchWishlistCount = async () => {
    try {
      console.log('🔄 [Navbar] fetchWishlistCount called');

      const savedWishlist = localStorage.getItem('wishlist');
      console.log('💾 [Navbar] Raw wishlist from localStorage:', savedWishlist);

      let wishlistCount = 0;

      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('📦 [Navbar] Parsed wishlist:', parsedWishlist);

          if (Array.isArray(parsedWishlist)) {
            wishlistCount = parsedWishlist.length;
            console.log('✅ [Navbar] Calculated wishlist count:', wishlistCount);
          } else {
            console.log('❌ [Navbar] Wishlist is not an array');
            wishlistCount = 0;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing wishlist from localStorage:', parseError);
          wishlistCount = 0;
        }
      } else {
        console.log('📭 [Navbar] No wishlist found in localStorage');
      }

      console.log('📊 [Navbar] Final wishlist count:', wishlistCount);
      setWishlistItemsCount(wishlistCount);
      localStorage.setItem('lastWishlistCount', wishlistCount.toString());

      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.id) {
            localStorage.setItem(`wishlistCount_${user.id}`, wishlistCount.toString());
          }
        } catch (error) {
          console.error('❌ [Navbar] Error parsing user data:', error);
        }
      }

      console.log('💾 [Navbar] Wishlist count saved to localStorage:', wishlistCount);
    } catch (error) {
      console.error('❌ [Navbar] Error fetching wishlist count:', error);
      setWishlistItemsCount(0);
      localStorage.setItem('lastWishlistCount', '0');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.CATEGORIES);
      const filteredCategories = data.filter((category: Category) => category.name !== 'ثيمات');
      setCategories(filteredCategories);
      localStorage.setItem('cachedCategories', JSON.stringify(filteredCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);

    const mergeLocalCartWithUserCart = async () => {
      try {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const localItems = JSON.parse(localCart);
          if (localItems.length > 0) {
            console.log('🔄 [Navbar] Merging local cart with user cart:', localItems.length, 'items');

            for (const item of localItems) {
              try {
                await apiCall(API_ENDPOINTS.USER_CART(userData.id), {
                  method: 'POST',
                  body: JSON.stringify({
                    productId: item.productId,
                    quantity: item.quantity,
                    selectedOptions: item.selectedOptions || {},
                    optionsPricing: item.optionsPricing || {},
                    attachments: item.attachments || {},
                    productName: item.product?.name || 'منتج',
                    price: item.product?.price || 0,
                    image: item.product?.mainImage || ''
                  })
                });
                console.log('✅ [Navbar] Merged item:', item.productId);
              } catch (error) {
                console.error('❌ [Navbar] Error merging item:', item.productId, error);
              }
            }

            try {
              const serverCart = await apiCall(API_ENDPOINTS.USER_CART(userData.id));
              localStorage.setItem('cart', JSON.stringify(serverCart));
              console.log('✅ [Navbar] Cart merged successfully, new cart size:', serverCart.length);

              window.dispatchEvent(new CustomEvent('cartUpdated'));

              smartToast.frontend.success('تم دمج سلة التسوق بنجاح! 🛒');
            } catch (error) {
              console.error('❌ [Navbar] Error fetching merged cart:', error);
            }
          } else {
            console.log('📭 [Navbar] Local cart is empty, no merge needed');
          }
        } else {
          console.log('📭 [Navbar] No local cart found');
        }
      } catch (error) {
        console.error('❌ [Navbar] Error in cart merge:', error);
      }
    };

    mergeLocalCartWithUserCart();

    smartToast.frontend.success(`مرحباً بك ${userData.firstName}! 🎉`);
  };

  const handleLogout = () => {
    const currentUser = user;
    setUser(null);
    localStorage.removeItem('user');

    if (currentUser?.id) {
      localStorage.removeItem(`cartCount_${currentUser.id}`);
      localStorage.removeItem(`wishlistCount_${currentUser.id}`);
    }

    setIsUserMenuOpen(false);
    setCartItemsCount(0);
    setWishlistItemsCount(0);

    navigate('/');
    smartToast.frontend.success('تم تسجيل الخروج بنجاح');
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Logo - Appears when scrolled and navbar is hidden */}
      {scrolled && !showNavbar && (
        <div 
          className="fixed top-6 right-6 z-[60] transition-all duration-300 ease-out opacity-100 translate-y-0 scale-100 pointer-events-auto"
          onMouseEnter={() => {
            console.log('Logo hovered - setting isLogoHovered to true', { scrolled, showNavbar, isLogoHovered });
            setIsLogoHovered(true);
          }}
          onMouseLeave={() => {
            console.log('Logo unhovered - will set isLogoHovered to false after 500ms', { scrolled, showNavbar, isLogoHovered });
            setTimeout(() => {
              console.log('Setting isLogoHovered to false now');
              setIsLogoHovered(false);
            }, 500);
          }}
        >
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="Logo" className="w-21 h-21 object-contain hover:scale-95 transition-transform duration-200" />
          </Link>
        </div>
      )}
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          showNavbar && !isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        dir="rtl"
        onMouseEnter={() => {
          if (scrolled && !isMenuOpen) {
            setIsLogoHovered(true);
          }
        }}
        onMouseLeave={() => {
          setTimeout(() => setIsLogoHovered(false), 500);
        }}
      >
        {/* Navbar Container with Rounded Corners */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div 
            className={`relative mx-auto max-w-7xl transition-all duration-500 ease-out rounded-2xl ${
              scrolled 
                ? 'bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20' 
                : 'bg-transparent border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm touch-manipulation relative overflow-hidden group"
                aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              >
                <div className="relative z-10">
                  {isMenuOpen ? <X size={22} className="sm:w-[24px] sm:h-[24px]" /> : <Menu size={22} className="sm:w-[24px] sm:h-[24px]" />}
                </div>
                <div className="absolute inset-0 bg-white/5 scale-0 group-active:scale-100 transition-transform duration-150 rounded-xl"></div>
              </button>

              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="cursor-pointer">
                  <img src={logo} alt="Logo" className="h-7 sm:h-8 w-auto" />
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {[
                  { name: 'الرئيسية', href: '/' },
                  { name: 'الخدمات', href: '/products' },
                  { name: 'أعمالنا', href: '/portfolio' },
                  { name: 'المدونة', href: '/blog' },
                  { name: 'الفئات', href: '/categories' },
                  { name: 'تواصل معنا', href: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative px-4 py-2 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-medium group ${
                      isActive(link.href) ? 'text-[#18b5d8]' : ''
                    }`}
                  >
                    {link.name}
                    <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#18b5d8] to-[#0891b2] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                
                

      {/* Cart Button with Dropdown */}
      <div className="relative" ref={cartDropdownRef}>
        <button 
          onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
          className="relative text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <ShoppingCart size={20} />
          {cartItemsCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-[#18b5d5] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-medium shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse"
              style={{ 
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(24,181,213,1))',
                animationDuration: '2s' // جعل الـ pulse أبطأ لتأثير أنيق
              }}
            >
              {cartItemsCount}
            </span>
          )}
          <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        <CartDropdown 
          isOpen={isCartDropdownOpen} 
          onClose={() => setIsCartDropdownOpen(false)}
          onHoverChange={setIsCartHovered}
        />
      </div>

      {/* Wishlist Button */}
      <Link to="/wishlist" className="relative text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group">
        <Heart size={20} />
        {wishlistItemsCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-[#18b5d5] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-medium shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse"
            style={{ 
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(24,181,213,1))',
              animationDuration: '2s' // جعل الـ pulse أبطأ لتأثير أنيق
            }}
          >
            {wishlistItemsCount}
          </span>
        )}
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

                {/* User Menu */}
      {user ? (
  <div className="relative" ref={userMenuRef}>
    <button 
      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
      className="flex items-center text-white/90 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 gap-3 group"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-[#18b5d8] to-[#0891b2] rounded-lg flex items-center justify-center">
        <User size={16} />
      </div>
      <span className="text-sm font-medium">{user.name?.split('   ')[0] || user.firstName || 'عميل'}</span>
      <ChevronDown size={16} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
    </button>
    
    {isUserMenuOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="p-2 space-y-2">
          <Link
            to="/profile"
            onClick={() => setIsUserMenuOpen(false)}
            className="flex items-center px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 gap-3"
          >
            <User size={18} />
            <span>الملف الشخصي</span>
          </Link>
          
          <div className="border-t border-white/10 my-2"></div>
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 gap-3"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <button 
    onClick={openAuthModal} 
    className="relative text-white bg-gradient-to-r from-[#18b5d8] to-[#0891b2] px-6 py-2 rounded-xl hover:from-[#0891b2] hover:to-[#18b5d8] transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
  >
    <span className="relative z-10">دخول</span>
    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 mobile-menu-overlay ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        {/* Mobile Menu Panel */}
        <div 
          className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white/10 backdrop-blur-2xl border-l border-white/20 p-4 sm:p-6 transform transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Close Button */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="transition-transform duration-200 hover:scale-105">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="text-white p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
              aria-label="إغلاق القائمة"
            >
              <div className="relative z-10">
                <X size={24} />
              </div>
              <div className="absolute inset-0 bg-red-500/10 scale-0 group-active:scale-100 transition-transform duration-150 rounded-xl"></div>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-1 mb-8">
            {[
              { name: 'الرئيسية', href: '/', icon: Home },
              { name: 'المنتجات', href: '/products', icon: Grid3X3 },
              { name: 'أعمالنا', href: '/portfolio', icon: Star },
              { name: 'المدونة', href: '/blog', icon: BookOpen },
              { name: 'الفئات', href: '/categories', icon: Package },
              { name: 'تواصل معنا', href: '/contact', icon: Phone }
            ].map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 space-x-3 group touch-manipulation relative overflow-hidden ${
                  isActive(link.href) ? 'bg-white/5 text-[#18b5d8]' : ''
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                }}
              >
                <link.icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-base">{link.name}</span>
                <ChevronLeft size={16} className="mr-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                {isActive(link.href) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#18b5d8] to-[#0891b2] rounded-r-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full px-4 py-3.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 space-x-3 touch-manipulation group relative overflow-hidden">
              <ShoppingCart size={20} className="flex-shrink-0" />
              <span className="text-base font-medium">سلة التسوق</span>
              {cartItemsCount > 0 && (
                <span className="mr-auto bg-[#18b5d8] text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold shadow-lg">
                  {cartItemsCount}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#18b5d8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full px-4 py-3.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 space-x-3 touch-manipulation group relative overflow-hidden">
              <Heart size={20} className="flex-shrink-0" />
              <span className="text-base font-medium">المفضلة</span>
              {wishlistItemsCount > 0 && (
                <span className="mr-auto bg-pink-500 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold shadow-lg">
                  {wishlistItemsCount}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            {!user && (
              <button 
                onClick={openAuthModal}
                className="flex items-center w-full px-4 py-3.5 text-white bg-gradient-to-r from-[#18b5d8] to-[#0891b2] rounded-xl hover:from-[#0891b2] hover:to-[#18b5d8] transition-all duration-300 space-x-3 shadow-lg mt-4 touch-manipulation relative overflow-hidden group"
              >
                <User size={20} className="flex-shrink-0" />
                <span className="font-bold text-base">تسجيل دخول</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Navbar;