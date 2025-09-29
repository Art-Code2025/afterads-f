import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smartToast } from '../../utils/toastConfig';
import { Heart, ShoppingCart, CheckCircle, ArrowUpDown } from 'lucide-react';
import { createProductSlug } from '../../utils/slugify';
import { addToCartUnified, addToWishlistUnified, removeFromWishlistUnified } from '../../utils/cartUtils';
import { buildImageUrl } from '../../config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId?: number | null;
  mainImage: string;
  detailedImages?: string[];
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    checkWishlistStatus();
  }, [product.id]);

  useEffect(() => {
    const handleWishlistUpdate = (event: any) => {
      if (event.detail && Array.isArray(event.detail)) {
        setIsInWishlist(event.detail.includes(product.id));
      } else {
        checkWishlistStatus();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [product.id]);

  const truncateDescription = (text: string, maxWords: number = 8): string => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const checkWishlistStatus = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setIsInWishlist(parsedWishlist.includes(product.id));
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل حالة المفضلة:', error);
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist) {
        const success = await removeFromWishlistUnified(product.id, product.name);
        if (success) setIsInWishlist(false);
      } else {
        const success = await addToWishlistUnified(product.id, product.name);
        if (success) setIsInWishlist(true);
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
      smartToast.frontend.error('حدث خطأ أثناء تحديث المفضلة');
    }
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const success = await addToCartUnified(product.id, product.name, quantity);
      if (success) {
        smartToast.frontend.success(`تمت إضافة ${product.name} إلى السلة`);
    } else {
      smartToast.frontend.error('فشل إضافة المنتج إلى السلة');
      }
    } catch (error) {
      console.error('خطأ في إضافة المنتج إلى السلة:', error);
      smartToast.frontend.error('حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < 99) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productPath = `/product/${createProductSlug(product.id, product.name)}`;
    navigate(productPath);
  };

  const gradients = [
    'from-[#292929]/95 via-[#18b5d8]/20 to-[#292929]/90',
    'from-[#292929]/90 via-[#18b5d8]/15 to-[#292929]/95',
    'from-[#292929]/93 via-[#18b5d8]/25 to-[#292929]/88'
  ];

  const overlayGradients = [
    'radial-gradient(circle at 50% 0%, rgba(24, 181, 216, 0.3), transparent 70%)',
    'radial-gradient(circle at 50% 0%, rgba(24, 181, 216, 0.2), transparent 70%)',
    'radial-gradient(circle at 50% 0%, rgba(24, 181, 216, 0.35), transparent 70%)'
  ];

  // ---- LIST VIEW ----
  if (viewMode === 'list') {
    return (
      <Link
        to={`/product/${createProductSlug(product.id, product.name)}`}
        className="relative group block bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] w-full overflow-hidden"
        onClick={handleProductClick}
        aria-label={`عرض تفاصيل المنتج ${product.name}`}
      >
        {/* Digital Effects */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute top-4 right-4 text-xs text-white/20 font-mono group-hover:text-white/30 transition-colors duration-500">
            <div className="animate-pulse">010101</div>
          </div>
          <div className="absolute bottom-4 left-4 text-xs text-white/15 font-mono group-hover:text-white/25 transition-colors duration-700">
            <div className="animate-pulse delay-300">110010</div>
          </div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-[#18b5d8]/30 via-[#18b5d8]/10 to-transparent transform -translate-x-1/2 skew-x-12 group-hover:-skew-x-6 transition-transform duration-700"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-[#18b5d8]/30 via-[#18b5d8]/10 to-transparent transform -translate-x-1/2 -skew-x-6 group-hover:skew-x-12 transition-transform duration-700"></div>
          <div className="absolute top-8 left-8 w-1 h-1 bg-[#18b5d8]/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-12 right-12 w-1 h-1 bg-[#0d8aa3]/60 rounded-full animate-ping delay-1000"></div>
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
               style={{
                 backgroundImage: `linear-gradient(rgba(24, 181, 216, 0.3) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(24, 181, 216, 0.3) 1px, transparent 1px)`,
                 backgroundSize: '20px 20px'
               }}>
          </div>
        </div>

        <div className="flex items-center p-6 gap-6">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#0d8aa3]/30 blur-sm rounded-xl group-hover:blur-md transition-all duration-500"></div>
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#18b5d8]/30">
              <img
                src={buildImageUrl(product.mainImage)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/assets/placeholder-product.jpg';
                }}
              />
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#18b5d8] to-[#0d8aa3] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                جديد
              </div>
              {product.isAvailable === false && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-lg text-xs">
                    نفذت الكمية
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 dir="rtl" className="text-2xl font-bold text-white mb-4 group-hover:text-[#18b5d8] transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-gray-200/80 text-sm leading-relaxed line-clamp-2 mb-6">
              {truncateDescription(product.description || `اكتشف ${product.name} عالي الجودة`)}
            </p>
            <ul className="space-y-2 text-gray-200/70 text-sm">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                    <span className="text-gray-400 line-through">{product.originalPrice.toFixed(2)} ر.س</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                    <span className="text-[#18b5d8] font-bold">{product.price.toFixed(2)} ر.س</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                    <span>خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                  </li>
                </>
              ) : (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                  <span className="text-[#18b5d8] font-bold">{product.price.toFixed(2)} ر.س</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                <span>{product.isAvailable ? 'متوفر' : 'غير متوفر'}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex flex-col items-end gap-3">
            <button
              onClick={toggleWishlist}
              className={`w-8 h-8 rounded-full bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm border border-[#18b5d8]/40 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isInWishlist ? 'text-red-500 border-red-500/40' : 'text-white'
              }`}
              type="button"
              aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
            </button>
            {product.isAvailable && (
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white border border-[#18b5d8]/40 hover:bg-gradient-to-r hover:from-[#18b5d8]/30 hover:to-[#0d8aa3]/30 hover:border-[#18b5d8]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 hover:scale-105"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-white text-base bg-gradient-to-r from-[#18b5d8]/10 to-[#0d8aa3]/10 rounded-lg py-1">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= 99}
                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white border border-[#18b5d8]/40 hover:bg-gradient-to-r hover:from-[#18b5d8]/30 hover:to-[#0d8aa3]/30 hover:border-[#18b5d8]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 hover:scale-105"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-[#18b5d8]/40 group-hover:bg-gradient-to-r group-hover:from-[#18b5d8]/30 group-hover:to-[#0d8aa3]/30 group-hover:border-[#18b5d8]/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(24,181,216,0.3)]"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="font-medium text-sm">إضافة للسلة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ---- GRID VIEW ----
  return (
    <Link
      to={`/product/${createProductSlug(product.id, product.name)}`}
      className="relative group block transform hover:scale-105 transition-all duration-500 w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:w-80 h-auto"
      onClick={handleProductClick}
      aria-label={`عرض تفاصيل المنتج ${product.name}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[0]} rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}></div>
      <div
        className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        style={{ background: overlayGradients[0] }}
      ></div>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute top-4 right-4 text-xs text-white/20 font-mono group-hover:text-white/30 transition-colors duration-500">
          <div className="animate-pulse">010101</div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-white/15 font-mono group-hover:text-white/25 transition-colors duration-700">
          <div className="animate-pulse delay-300">110010</div>
        </div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#18b5d8]/40 via-[#18b5d8]/20 to-transparent transform -translate-x-1/2 -skew-x-12 group-hover:skew-x-12 transition-transform duration-700"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-[#18b5d8]/30 via-[#18b5d8]/10 to-transparent transform -translate-x-1/2 skew-x-12 group-hover:-skew-x-6 transition-transform duration-700"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-[#18b5d8]/30 via-[#18b5d8]/10 to-transparent transform -translate-x-1/2 -skew-x-6 group-hover:skew-x-12 transition-transform duration-700"></div>
        <div className="absolute top-8 left-8 w-1 h-1 bg-[#18b5d8]/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-12 right-12 w-1 h-1 bg-[#0d8aa3]/60 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-16 right-16 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse delay-500"></div>
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
             style={{
               backgroundImage: `linear-gradient(rgba(24, 181, 216, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(24, 181, 216, 0.3) 1px, transparent 1px)`,
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      <div className="relative p-8 text-center">
        <div className="relative mx-auto mb-8 w-20 h-20">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#18b5d8]/30 to-[#0d8aa3]/30 blur-sm transform rotate-0 group-hover:rotate-6 transition-all duration-500"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/20 to-[#0d8aa3]/10 backdrop-blur-md border border-[#18b5d8]/30 transform rotate-0 group-hover:rotate-6 transition-all duration-500"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
          </div>
          <div className="absolute inset-2 bg-gradient-to-br from-[#18b5d8]/15 to-transparent transform rotate-0 group-hover:-rotate-3 transition-all duration-700"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
          </div>
          <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
            <img
              src={buildImageUrl(product.mainImage)}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-lg filter brightness-125 drop-shadow-[0_0_10px_rgba(24,181,216,0.5)]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/assets/placeholder-product.jpg';
              }}
            />
          </div>
          <div className="absolute top-0 right-0 bg-gradient-to-r from-[#18b5d8] to-[#0d8aa3] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-[#18b5d8]/30">
            جديد
          </div>
        </div>

        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleWishlist}
            className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm border border-[#18b5d8]/40 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isInWishlist ? 'text-red-500 border-red-500/40' : 'text-white'
            }`}
            type="button"
            aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
          </button>
        </div>

        {product.isAvailable === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-3xl backdrop-blur-sm">
            <span className="text-white font-bold bg-red-600 px-4 py-2 rounded-lg text-sm shadow-lg border border-red-500">
              نفذت الكمية
            </span>
          </div>
        )}

        <h3 dir="rtl" className="text-2xl font-bold text-white mb-4 group-hover:text-[#18b5d8] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-200/80 mb-6 leading-relaxed text-sm line-clamp-2">
          {truncateDescription(product.description || `اكتشف ${product.name} عالي الجودة`)}
        </p>

        <ul className="space-y-2 text-gray-200/70 text-sm mb-6">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                <span className="text-gray-400 line-through">{product.originalPrice.toFixed(2)} ر.س</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                <span className="text-[#18b5d8] font-bold">{product.price.toFixed(2)} ر.س</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
                <span>خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
              </li>
            </>
          ) : (
            <li className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
              <span className="text-[#18b5d8] font-bold">{product.price.toFixed(2)} ر.س</span>
            </li>
          )}
          <li className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#18b5d5]" />
            <span>{product.isAvailable ? 'متوفر' : 'غير متوفر'}</span>
          </li>
        </ul>

        {product.isAvailable && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white border border-[#18b5d8]/40 hover:bg-gradient-to-r hover:from-[#18b5d8]/30 hover:to-[#0d8aa3]/30 hover:border-[#18b5d8]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 hover:scale-105"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-white text-lg bg-gradient-to-r from-[#18b5d8]/10 to-[#0d8aa3]/10 rounded-lg py-1">{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= 99}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white border border-[#18b5d8]/40 hover:bg-gradient-to-r hover:from-[#18b5d8]/30 hover:to-[#0d8aa3]/30 hover:border-[#18b5d8]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 hover:scale-105"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#18b5d8]/20 to-[#0d8aa3]/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-[#18b5d8]/40 group-hover:bg-gradient-to-r group-hover:from-[#18b5d8]/30 group-hover:to-[#0d8aa3]/30 group-hover:border-[#18b5d8]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(24,181,216,0.3)] w-full justify-center"
            >
              <ShoppingCart className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="font-medium">إضافة للسلة</span>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;