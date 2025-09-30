import React, { useState, useEffect, useRef, useMemo } from 'react';
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}
import { Link } from 'react-router-dom';
import { smartToast } from './utils/toastConfig';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Package, Gift, Sparkles, ArrowLeft, Plus, Minus, Star, Users, Shield, Crown, Truck, Medal, Award, Tag, Zap, Code, Smartphone, Globe, Palette, CheckCircle, ArrowRight, Monitor, Database, Cloud, Phone, Mail, MapPin, Quote, User } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaUser } from 'react-icons/fa';
import { apiCall, API_ENDPOINTS, buildImageUrl } from './config/api';
import WhatsAppButton from './components/ui/WhatsAppButton';
import ScrollProgressIndicator from './components/ui/ScrollProgressIndicator';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import LoadingScreen from './components/ui/LoadingScreen';
import { useLoading } from './contexts/LoadingContext';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import AboutUsSection from './components/home/AboutUsSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import ClientsSection from './components/home/ClientsSection';
import ThemesSection from './components/home/ThemesSection';
import FAQSection from './components/home/FAQSection';
import ContactSection from './components/home/ContactSection';
import { createCategorySlug, createProductSlug } from './utils/slugify';
import { addToCartUnified, addToWishlistUnified, removeFromWishlistUnified } from './utils/cartUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  mainImage: string;
  detailedImages?: string[];
  productType?: string;
  createdAt?: string;
}

interface Theme {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  mainImage: string;
  detailedImages?: string[];
  createdAt?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  categoryType?: 'regular' | 'theme';
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  showInFooter: boolean;
  createdAt: string;
}

interface Testimonial {
  id: number;
  name: string;
  testimonial: string;
  image?: string;
  createdAt: string;
}

interface Client {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

const App: React.FC = () => {
  const { isLoading, setIsLoading } = useLoading();
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState<number>(0);
  const [currentClientIndex, setCurrentClientIndex] = useState<number>(0);
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] = useState<boolean>(false);
  const [isClientTransitioning, setIsClientTransitioning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const clientIntervalRef = useRef<number | null>(null);
  const testimonialIntervalRef = useRef<number | null>(null);
  const testimonialsTrackRef = useRef<HTMLDivElement | null>(null);

  const slides = [
    {
      title: 'خدمات احترافية متميزة',
      subtitle: 'نقدم لك أفضل الخدمات بجودة عالية وأسعار منافسة'
    },
    {
      title: 'فريق عمل محترف',
      subtitle: 'خبراء متخصصون في جميع المجالات لخدمتك'
    },
    {
      title: 'ضمان الجودة والتميز',
      subtitle: 'نضمن لك الحصول على أفضل النتائج'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]);

  useEffect(() => {
    fetchCategoryProducts();
    fetchStaticPages();
    fetchTestimonials();
    fetchClients();
    loadWishlistFromStorage();
  }, []);

  useEffect(() => {
  console.log("Home Mounted");
}, []);
  // سيتم نقل useEffect للأنيميشن التلقائي بعد تعريف الدوال

  // سلايدر الشهادات: تنقل دائري مع أسهم
  const scrollByOneCard = (dir: 1 | -1) => {
    const ref = testimonialsTrackRef.current;
    if (!ref || testimonials.length === 0) {
      console.log('❌ [Testimonials] Ref not found or no testimonials:', { ref: !!ref, testimonialsLength: testimonials.length });
      return;
    }
    
    console.log('🔄 [Testimonials] Scrolling direction:', dir === 1 ? 'right' : 'left');
    
    const firstCard = ref.querySelector('[data-testimonial-card]') as HTMLElement | null;
    if (!firstCard) {
      console.log('❌ [Testimonials] No testimonial card found');
      return;
    }
    
    const cardW = firstCard.offsetWidth || 400; // استخدام العرض الافتراضي
    const gap = 24; // gap-6 بين الكروت
    const amount = (cardW + gap) * dir;
    
    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;
    
    console.log('📊 [Testimonials] Scroll info:', {
      cardWidth: cardW,
      gap,
      amount,
      currentScroll,
      maxScroll,
      scrollWidth: ref.scrollWidth,
      clientWidth: ref.clientWidth
    });
    
    if (dir === 1) {
      // التحرك يميناً
      if (currentScroll >= maxScroll - 10) {
        // وصلنا للنهاية، نعود للبداية
        console.log('🔄 [Testimonials] Reached end, going to start');
        ref.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        console.log('➡️ [Testimonials] Scrolling right by:', amount);
        ref.scrollBy({ left: amount, behavior: 'smooth' });
      }
    } else {
      // التحرك شمالاً
      if (currentScroll <= 10) {
        // وصلنا للبداية، نذهب للنهاية
        console.log('🔄 [Testimonials] Reached start, going to end');
        ref.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        console.log('⬅️ [Testimonials] Scrolling left by:', amount);
        ref.scrollBy({ left: amount, behavior: 'smooth' });
      }
    }
  };

  const handleNextTestimonial = () => {
    console.log('🎯 [Testimonials] Next button clicked');
    scrollByOneCard(1);
  };
  
  const handlePrevTestimonial = () => {
    console.log('🎯 [Testimonials] Previous button clicked');
    scrollByOneCard(-1);
  };

  useEffect(() => {
    if (clients.length > 1) {
      clientIntervalRef.current = setInterval(() => {
        setIsClientTransitioning(true);
        setTimeout(() => {
          setCurrentClientIndex((prev) => (prev + 1) % clients.length);
          setIsClientTransitioning(false);
        }, 300);
      }, 3000);

      return () => {
        if (clientIntervalRef.current) {
          clearInterval(clientIntervalRef.current);
        }
      };
    }
  }, [clients.length]);

  // تم استبدال هذا بـ useEffect الجديد أعلاه

  const loadWishlistFromStorage = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.CATEGORIES),
        apiCall(API_ENDPOINTS.PRODUCTS)
      ]);
      
      const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];
      const products = Array.isArray(productsResponse) ? productsResponse : [];
      
      // فصل الفئات العادية عن فئات الثيمات
      const regularCategories = categories.filter((category: Category) => 
        category.name !== 'ثيمات'
      );
      
      // فصل المنتجات العادية عن الثيمات
      const themeProducts = products.filter((product: Product) => 
        product.name?.includes('ثيم') || 
        product.productType === 'theme' ||
        product.productType?.includes('ثيم')
      );
      
      const regularProducts = products.filter((product: Product) => 
        !product.name?.includes('ثيم') && 
        product.productType !== 'theme' &&
        !product.productType?.includes('ثيم')
      );
      
      const categoryProductsData = regularCategories.map((category: Category) => ({
        category,
        products: regularProducts.filter((product: Product) => product.categoryId === category.id)
      }));
      
      setCategoryProducts(categoryProductsData);
      setThemes(themeProducts);
      console.log('Theme products found:', themeProducts.length, themeProducts);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
      smartToast.frontend.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticPages = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.STATIC_PAGES);
      
      // تحقق من البنية الصحيحة للاستجابة
      if (Array.isArray(response)) {
        const footerPages = response.filter((page: StaticPage) => page.showInFooter);
        setStaticPages(footerPages);
      } else if (response.success && Array.isArray(response.data)) {
        const footerPages = response.data.filter((page: StaticPage) => page.showInFooter);
        setStaticPages(footerPages);
      }
    } catch (error) {
      console.error('Error fetching static pages:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.TESTIMONIALS);
      console.log('📝 [App] Testimonials response:', response);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        setTestimonials(response);
      } else if (response.success && Array.isArray(response.data)) {
        setTestimonials(response.data);
      } else if (response.testimonials && Array.isArray(response.testimonials)) {
        setTestimonials(response.testimonials);
      } else {
        console.warn('⚠️ [App] Unexpected testimonials response format:', response);
        setTestimonials([]);
      }
    } catch (error) {
      console.error('❌ [App] Error fetching testimonials:', error);
      setTestimonials([]);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.CLIENTS);
      console.log('🏢 [App] Clients response:', response);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        setClients(response);
      } else if (response.success && Array.isArray(response.data)) {
        setClients(response.data);
      } else if (response.clients && Array.isArray(response.clients)) {
        setClients(response.clients);
      } else {
        console.warn('⚠️ [App] Unexpected clients response format:', response);
        setClients([]);
      }
    } catch (error) {
      console.error('❌ [App] Error fetching clients:', error);
      setClients([]);
    }
  };

  const handleQuantityIncrease = (productId: number, maxStock: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity < maxStock) {
        return { ...prev, [productId]: currentQuantity + 1 };
      }
      return prev;
    });
  };

  const handleQuantityDecrease = (productId: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity > 1) {
        return { ...prev, [productId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      const quantity = quantities[productId] || 1;
      const product = categoryProducts
        .flatMap(cp => cp.products)
        .find(p => p.id === productId);
      
      if (!product) {
        smartToast.frontend.error('المنتج غير موجود');
        return;
      }
      
      const productPrice = product.price;
      const productImage = product.mainImage;
      
      if (!product.isAvailable) {
        smartToast.frontend.error('الكمية المطلوبة غير متوفرة في المخزون');
        return;
      }
      
      console.log('🛒 [App] Adding to cart:', { productId, productName, quantity, productPrice, productImage });
      
      const success = await addToCartUnified(productId, productName, quantity, {}, productPrice, productImage);
      if (success) {
        console.log('✅ [App] Successfully added to cart');
        setQuantities(prev => ({ ...prev, [productId]: 1 }));
      } else {
        console.log('❌ [App] Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      smartToast.frontend.error('فشل في إضافة المنتج للسلة');
    }
  };

  const handleWishlistToggle = async (productId: number, productName: string) => {
    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        const success = await removeFromWishlistUnified(productId, productName);
        if (success) {
          setWishlist(prev => prev.filter(id => id !== productId));
        }
      } else {
        const success = await addToWishlistUnified(productId, productName);
        if (success) {
          setWishlist(prev => [...prev, productId]);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      smartToast.frontend.error('فشل في تحديث قائمة الأمنيات');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const allProducts = useMemo(() => {
    return categoryProducts.flatMap(cp => cp.products);
  }, [categoryProducts]);

  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 8);
  }, [allProducts]);

 

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800">حدث خطأ</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchCategoryProducts}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
<div className={`min-h-screen w-full bg-[#292929] transition-all  duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>      
      {/* Hero Section */}
      <HeroSection />


 {/* Why Choose Us Section */}
      <AboutUsSection />
 
 {/* Clients Section */}
      <section data-section="clients">
        <ClientsSection clients={clients} />
      </section>

{/* Categories Section */}
      <CategoriesSection 
        loading={loading}
        categoryProducts={categoryProducts}
      />


      {/* Themes Section */}
      <section data-section="themes">
        <ThemesSection themes={themes} />
      </section>



     

      {/* Testimonials Section */}

      <TestimonialsSection testimonials={testimonials} />

 

      {/* FAQ Section */}
      <section data-section="faq">
        <FAQSection />
      </section>



      {/* Contact Section */}
      <section data-section="contact">
        <ContactSection />
      </section>







     

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />

   
    </div>
  );
}

export default App;