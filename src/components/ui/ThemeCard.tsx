import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smartToast } from '../../utils/toastConfig';
import { Heart, Eye, Palette, ShoppingCart, Sparkles } from 'lucide-react';
import { createProductSlug } from '../../utils/slugify';
import { addToCartUnified, addToWishlistUnified, removeFromWishlistUnified } from '../../utils/cartUtils';
import { buildImageUrl, apiCall, API_ENDPOINTS } from '../../config/api';

interface Theme {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId?: number | null;
  productType?: 'product' | 'theme';
  mainImage: string;
  detailedImages?: string[];
  createdAt?: string;
}

interface ThemeCardProps {
  theme: Theme;
  viewMode?: 'grid' | 'list';
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, viewMode = 'grid' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Load wishlist status from localStorage
  useEffect(() => {
    checkWishlistStatus();
  }, [theme.id]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = (event: any) => {
      if (event.detail && Array.isArray(event.detail)) {
        setIsInWishlist(event.detail.includes(theme.id));
      } else {
        checkWishlistStatus();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [theme.id]);

  const checkWishlistStatus = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(wishlist.includes(theme.id));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist) {
        const success = await removeFromWishlistUnified(theme.id, theme.name);
        if (success) {
          setIsInWishlist(false);
          smartToast.frontend.success('تم إزالة الثيم من المفضلة');
        }
      } else {
        const success = await addToWishlistUnified(theme.id, theme.name);
        if (success) {
          setIsInWishlist(true);
          smartToast.frontend.success('تم إضافة الثيم للمفضلة');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      smartToast.frontend.error('حدث خطأ في تحديث المفضلة');
    }
  };

  const isOutOfStock = !theme.isAvailable;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🛒 [ThemeCard] addToCart called:', { themeId: theme.id, quantity });

    try {
      const success = await addToCartUnified(theme.id, theme.name, quantity);
      if (success) {
        console.log('✅ [ThemeCard] Theme added to cart successfully');
      } else {
        console.log('❌ [ThemeCard] Failed to add to cart');
      }
    } catch (error) {
      console.error('❌ [ThemeCard] Error in addToCart:', error);
    }
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < 99) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleThemeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const themePath = `/theme/${createProductSlug(theme.id, theme.name)}`;
    console.log('🔗 [ThemeCard] Navigating to:', themePath);
    navigate(themePath);
  };

  // ---- LIST VIEW ----
  if (viewMode === 'list') {
    return (
      <div
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl md:rounded-3xl border border-purple-200 shadow-md sm:shadow-lg overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleThemeClick}
      >
        <div className="flex flex-col md:flex-row p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6">
          <div className="relative w-full md:w-40 lg:w-48 xl:w-64 h-48 sm:h-56 md:h-64 lg:h-72 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
            <img
              src={buildImageUrl(theme.mainImage)}
              alt={theme.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              ثيم
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl">
                <span className="text-white font-semibold bg-red-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm">
                  نفذت الكمية
                </span>
              </div>
            )}
            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
              <button
                onClick={toggleWishlist}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 touch-button wishlist-button ${isInWishlist
                    ? 'bg-red-100 hover:bg-red-200'
                    : 'bg-white hover:bg-gray-100'
                  }`}
                type="button"
                aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <Heart
                  className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors duration-200 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'
                    }`}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight hover:text-purple-500 transition-colors duration-200">
                {theme.name}
              </h3>
              <div className="flex flex-col items-start gap-1 mb-2 sm:mb-3">
                {theme.originalPrice && theme.originalPrice > theme.price ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                        {theme.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">ر.س</span>
                      <span className="bg-purple-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-bold">
                        -{Math.round(((theme.originalPrice - theme.price) / theme.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                        {theme.price.toFixed(2)}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">ر.س</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                      {theme.price.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">ر.س</span>
                  </div>
                )}
              </div>
              {isOutOfStock && (
                <p className="text-sm sm:text-base font-semibold text-red-600">نفذت الكمية</p>
              )}
            </div>

            {!isOutOfStock && (
              <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                {/* Quantity controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-purple-600 font-bold text-sm transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="w-8 sm:w-10 md:w-12 text-center font-semibold text-gray-800 text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= 99}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-purple-600 font-bold text-sm transition-colors duration-200"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={addToCart}
                    disabled={false}
                    className="flex-1 disabled:opacity-50 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm md:text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <>
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>إضافة للسلة</span>
                    </>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- GRID VIEW - THEME DESIGN ----
  return (
    <div
      className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl sm:rounded-3xl border border-purple-200 shadow-lg sm:shadow-xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.02] sm:hover:scale-[1.03] w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:w-80 h-auto group cursor-pointer relative"
      onClick={handleThemeClick}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 sm:from-purple-500/20 via-transparent to-pink-500/10 sm:to-pink-500/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500 -z-10"></div>

      {/* Theme Image */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-purple-100 to-pink-100">
        <img
          src={buildImageUrl(theme.mainImage)}
          alt={theme.name}
          className="w-full h-full object-cover transition-all duration-500 sm:duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center&auto=format,compress&q=60&ixlib=rb-4.0.3';
          }}
        />

        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 sm:from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>

        {/* Theme Badge - Left side */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-purple-400/30 z-10 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          ثيم
        </div>

        {/* Wishlist Button - Top Right Corner */}
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={toggleWishlist}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 touch-button wishlist-button ${isInWishlist
                ? 'bg-red-100 hover:bg-red-200 border border-red-200'
                : 'bg-white/90 hover:bg-white border border-white/50 backdrop-blur-sm'
              }`}
            type="button"
            aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`}
            />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-2xl sm:rounded-t-3xl z-20">
            <span className="text-white font-bold bg-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* Theme Info */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-center">
        {/* Theme Name */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight hover:text-purple-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {theme.name}
        </h3>

        {/* Elegant Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-12 sm:w-16 mx-auto"></div>

        {/* Price */}
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          {theme.originalPrice && theme.originalPrice > theme.price ? (
            <>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                  {theme.originalPrice.toFixed(0)} ر.س
                </span>
                <span className="bg-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                  -{Math.round(((theme.originalPrice - theme.price) / theme.originalPrice) * 100)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {theme.price.toFixed(0)} <span className="text-base sm:text-lg text-gray-600">ر.س</span>
              </div>
            </>
          ) : (
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {theme.price.toFixed(0)} <span className="text-base sm:text-lg text-gray-600">ر.س</span>
            </div>
          )}

          {/* Availability Indicator */}
          <div className="text-sm">
            {theme.isAvailable ? (
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">متوفر</span>
            ) : (
              <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">غير متوفر</span>
            )}
          </div>
        </div>

        {isOutOfStock && (
          <p className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-full">غير متوفر</p>
        )}

        {/* Actions */}
        {!isOutOfStock && (
          <div className="w-full space-y-2 sm:space-y-3 mt-3 sm:mt-4">
            {/* Quantity controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-purple-600 font-bold transition-all duration-200 hover:scale-105 sm:hover:scale-110 text-sm sm:text-base"
              >
                -
              </button>
              <span className="w-10 sm:w-12 text-center font-bold text-gray-800 text-base sm:text-lg bg-purple-50 py-1 rounded-md sm:rounded-lg">{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= 99}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-purple-600 font-bold transition-all duration-200 hover:scale-105 sm:hover:scale-110 text-sm sm:text-base"
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              disabled={false}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-md sm:shadow-lg disabled:opacity-50 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg sm:hover:shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <>
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>إضافة للسلة</span>
              </>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeCard;