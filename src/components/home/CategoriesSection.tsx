import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, TrendingUp, PenTool, Zap, Star } from 'lucide-react';
import { buildImageUrl } from '../../config/api';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  categoryType?: 'regular' | 'theme';
}

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

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CategoriesSectionProps {
  categoryProducts: CategoryProducts[];
  loading: boolean;
}

const styles = `
  @keyframes smoothFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes fadeSlideUp {
    from { 
      opacity: 0; 
      transform: translateY(40px) scale(0.95);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
  }

  @keyframes gentlePulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-smoothFloat { 
    animation: smoothFloat 8s ease-in-out infinite;
  }
  
  .animate-fadeSlideUp {
    animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-gentlePulse {
    animation: gentlePulse 3s ease-in-out infinite;
  }

  .animate-spinSlow {
    animation: spinSlow 15s linear infinite;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #18b5d5 0%, #0ea5c4 25%, #18b5d5 50%, #0ea5c4 75%, #18b5d5 100%);
    background-size: 200% auto;
    animation: shimmer 4s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ultra-smooth {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gpu-accelerate {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoryProducts, loading }) => {
  const [isMobile, setIsMobile] = useState(false);
  const orderedIcons = [Monitor, Smartphone, TrendingUp, PenTool];
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getServiceIcon = (index: number) => {
    return index < 4 ? orderedIcons[index] : Monitor;
  };

  const createCategorySlug = (name: string, id: number) => {
    const slug = name
      .replace(/\s+/g, '-')
      .replace(/[^\w\-أ-ي]/g, '')
      .toLowerCase();
    return `${slug}-${id}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeSlideUp');
              entry.target.classList.remove('opacity-0');
            }, index * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [categoryProducts]);

  if (loading) {
    return (
      <section data-section="categories" className="py-12 md:py-20 bg-[#292929] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="h-6 md:h-8 bg-[#1f1f1f]/70 rounded-full w-32 md:w-48 mx-auto mb-3 md:mb-4 animate-gentlePulse"></div>
            <div className="h-4 md:h-6 bg-[#1f1f1f]/70 rounded-full w-64 md:w-96 mx-auto animate-gentlePulse"></div>
          </div>
          <div className="space-y-4 md:space-y-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-[#1f1f1f]/70 rounded-xl md:rounded-3xl p-4 md:p-8 h-64 md:h-96 animate-gentlePulse border border-[#18b5d5]/10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#18b5d5]/10 rounded-xl mb-3 md:mb-4"></div>
                <div className="h-4 md:h-6 bg-[#18b5d5]/10 rounded w-24 md:w-32 mb-3 md:mb-4"></div>
                <div className="h-3 md:h-4 bg-[#18b5d5]/10 rounded w-full mb-2"></div>
                <div className="h-3 md:h-4 bg-[#18b5d5]/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <section data-section="categories" className="py-12 md:py-24 bg-[#292929] relative overflow-hidden">
        {/* خلفية مبسطة وأنيقة */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#292929] via-[#2d2d2d] to-[#292929]">
          {!isMobile && (
            <>
              <div className="absolute top-20 left-20 w-80 h-80 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat" style={{ animationDelay: '2s' }}></div>
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-4 bg-[#1f1f1f]/70 border border-[#18b5d5]/30 text-[#18b5d5] px-4 sm:px-8 py-2 sm:py-4 rounded-full mb-6 md:mb-10 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/50 hover:scale-105 hover:shadow-lg hover:shadow-[#18b5d5]/20 gpu-accelerate">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 animate-gentlePulse" />
              <span className="font-bold text-sm sm:text-lg">خدماتنا المتميزة</span>
              <Star className="w-3 h-3 sm:w-5 sm:h-5 animate-spinSlow" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-8 leading-tight px-2">
              حلول <span className="gradient-text">تقنية</span> متكاملة
            </h2>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-[#ffffff]/80 max-w-4xl mx-auto leading-relaxed font-light px-4">
              نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية جميع احتياجات أعمالك الرقمية بأحدث التقنيات العالمية
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-6 md:space-y-12 mb-12 md:mb-20">
            {categoryProducts.map((categoryProduct, index) => {
              const IconComponent = getServiceIcon(index);
              const isEven = index % 2 === 0;
              return (
                <div
                  key={categoryProduct.category.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="opacity-0 gpu-accelerate"
                >
                  <Link
                    to={`/category/${createCategorySlug(categoryProduct.category.name, categoryProduct.category.id)}`}
                    className="group relative overflow-hidden rounded-xl md:rounded-[2rem] h-[380px] sm:h-[420px] md:h-[450px] w-full block bg-[#1f1f1f]/60 border border-[#18b5d5]/20 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/50 hover:shadow-2xl hover:shadow-[#18b5d5]/30 hover:scale-[1.02] gpu-accelerate"
                  >
                    <div className={`relative z-20 h-full flex flex-col md:${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Image Section */}
                      <div className="w-full md:w-2/5 h-32 md:h-full relative overflow-hidden">
                        <div className="absolute inset-0 ultra-smooth group-hover:scale-110">
                          {categoryProduct.category.image ? (
                            <img
                              src={buildImageUrl(categoryProduct.category.image)}
                              alt={categoryProduct.category.name}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#18b5d5]/10 to-[#292929]/30 flex items-center justify-center">
                              <IconComponent className="w-12 h-12 md:w-24 md:h-24 text-[#18b5d5]/60 ultra-smooth group-hover:scale-110 group-hover:text-[#18b5d5]" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#18b5d5]/5 to-transparent opacity-0 ultra-smooth group-hover:opacity-100"></div>
                      </div>

                      {/* Content Section */}
                      <div
                        className={`flex-1 p-4 sm:p-6 md:p-12 flex flex-col ${
                          isEven ? "md:items-start md:text-left" : "md:items-end md:text-right"
                        } items-center text-center`}
                      >
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#18b5d5] mb-3 md:mb-6 ultra-smooth group-hover:scale-110 group-hover:text-white group-hover:rotate-6" />

                        <div className="flex flex-col flex-1 w-full">
                          <h3
                            className={`text-lg sm:text-xl md:text-3xl font-black text-white mb-2 md:mb-3 leading-tight ultra-smooth group-hover:text-[#18b5d5] ${
                              isEven ? "md:text-left" : "md:text-right"
                            } text-center`}
                          >
                            {categoryProduct.category.name}
                          </h3>
                          <p
                            className={`text-[#ffffff]/70 mb-4 md:mb-8 text-sm sm:text-base leading-relaxed ultra-smooth group-hover:text-[#ffffff]/90 line-clamp-3 ${
                              isEven ? "md:text-left" : "md:text-right"
                            } text-center`}
                          >
                            {categoryProduct.category.description}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-4 ${
                            isEven ? "md:justify-start" : "md:justify-end"
                          } justify-center mt-auto w-full`}
                        >
                          <div className="inline-flex items-center gap-2 md:gap-3 justify-center w-32 sm:w-36 md:w-44 h-10 sm:h-12 md:h-14 bg-[#18b5d5]/20 border border-[#18b5d5]/50 text-[#18b5d5] text-sm md:text-base font-bold rounded-xl md:rounded-2xl ultra-smooth hover:bg-[#18b5d5]/30 hover:shadow-xl hover:shadow-[#18b5d5]/30 hover:scale-110 hover:-translate-y-1 gpu-accelerate">
                            اكتشف الخدمة
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesSection;