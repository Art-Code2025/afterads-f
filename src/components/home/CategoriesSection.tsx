import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, TrendingUp, PenTool, Zap, Star, ArrowLeft } from 'lucide-react';
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

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoryProducts, loading }) => {
  const orderedIcons = [Monitor, Smartphone, TrendingUp, PenTool];

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

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-card-reveal');
              entry.target.classList.remove('opacity-0', 'scale-95');
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
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
            <div className="h-6 md:h-8 bg-[#ffffff]/10 backdrop-blur-md rounded w-32 md:w-48 mx-auto mb-3 md:mb-4 animate-pulse"></div>
            <div className="h-4 md:h-6 bg-[#ffffff]/10 backdrop-blur-md rounded w-64 md:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-4 md:space-y-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-[#ffffff]/10 backdrop-blur-md rounded-xl md:rounded-3xl p-4 md:p-8 h-64 md:h-128 animate-pulse border border-[#18b5d5]/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#ffffff]/10 rounded-xl mb-3 md:mb-4"></div>
                <div className="h-4 md:h-6 bg-[#ffffff]/10 rounded w-24 md:w-32 mb-3 md:mb-4"></div>
                <div className="h-3 md:h-4 bg-[#ffffff]/10 rounded w-full mb-2"></div>
                <div className="h-3 md:h-4 bg-[#ffffff]/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-section="categories" className="py-12 md:py-24 bg-[#292929] relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292929]/80 via-[#333333]/80 to-[#292929]/80"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-[#18b5d5]/80 font-mono text-sm animate-float filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
            &lt;section className="hero"&gt;
          </div>
          <div className="absolute top-40 right-20 text-[#18b5d5]/50 font-mono text-xs animate-float-delayed filter drop-shadow-[0_0_8px_rgba(24,181,213,0.3)]">
            const analytics = () =&gt; {}
          </div>
          <div className="absolute bottom-60 left-32 text-[#18b5d5]/70 font-mono text-sm animate-float-slow filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
            useState([data, setData])
          </div>
          <div className="absolute bottom-32 right-10 text-[#18b5d5]/40 font-mono text-xs animate-bounce-slow filter drop-shadow-[0_0_8px_rgba(24,181,213,0.3)]">
            API.optimize.SEO();
          </div>
          <div className="absolute top-80 left-1/2 text-[#18b5d5]/60 font-mono text-sm animate-pulse filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
            fetch('/products').then()
          </div>
        </div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-[#18b5d5]/50 rounded-full filter blur-md ${
                i % 2 === 0 ? 'animate-pulse' : 'animate-ping'
              } drop-shadow-[0_0_15px_rgba(24,181,213,0.6)]`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 sm:gap-4 bg-[#ffffff]/10 backdrop-blur-lg border border-[#18b5d5]/30 text-[#18b5d5] px-4 sm:px-8 py-2 sm:py-4 rounded-full mb-6 md:mb-10 shadow-lg shadow-[#18b5d5]/10">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
            <span className="font-bold text-sm sm:text-lg">خدماتنا المتميزة</span>
            <Star className="w-3 h-3 sm:w-5 sm:h-5 animate-spin-slow" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-8 leading-tight px-2">
            حلول <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18b5d5] to-[#0d8aa3] animate-pulse">تقنية</span> متكاملة
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-[#ffffff]/80 max-w-4xl mx-auto leading-relaxed font-light px-4">
            نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية جميع احتياجات أعمالك الرقمية بأحدث التقنيات العالمية
          </p>
        </div>

        <div className="space-y-6 md:space-y-12 mb-12 md:mb-20">
          {categoryProducts.map((categoryProduct, index) => {
            const IconComponent = getServiceIcon(index);
            const isEven = index % 2 === 0;
            return (
              <div
                key={categoryProduct.category.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="opacity-0 scale-95 will-change-transform transition-all duration-700"
              >
                <Link
                  to={`/category/${createCategorySlug(categoryProduct.category.name, categoryProduct.category.id)}`}
                  className="group relative overflow-hidden rounded-xl md:rounded-[2rem] h-[400px] sm:h-[450px] md:h-[450px] w-full block bg-[#ffffff]/10 backdrop-blur-lg border border-[#18b5d5]/30 hover:border-[#18b5d5]/60 shadow-lg shadow-[#18b5d5]/10 hover:shadow-2xl hover:shadow-[#18b5d5]/40 transition-all duration-500 [box-shadow:0_4px_30px_rgba(0,0,0,0.2)]"
                >
                  <div className={`relative z-20 h-full flex flex-col md:${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-full md:w-2/5 h-32 md:h-full min-w-0 max-w-md max-h-full relative overflow-hidden">
                      <div className="absolute inset-0">
                        {categoryProduct.category.image ? (
                          <img
                            src={buildImageUrl(categoryProduct.category.image)}
                            alt={categoryProduct.category.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#18b5d5]/10 to-[#292929]/30 flex items-center justify-center">
                            <IconComponent className="w-12 h-12 md:w-24 md:h-24 text-[#18b5d5]/60 group-hover:scale-110 transition-all duration-300" />
                          </div>
                        )}
                      </div>
                    </div>
        <div
                className={`flex-1 p-4 sm:p-6 md:p-12 flex flex-col ${
                  isEven ? "md:items-start md:text-left" : "md:items-end md:text-right"
                } items-center text-center overflow-hidden`}
              >
                <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#18b5d5] mb-3 md:mb-6 opacity-90 group-hover:scale-110 group-hover:text-white transition-all duration-300" />

                <div className="flex flex-col flex-1 w-full">
                  <h3
                    className={`text-lg sm:text-xl md:text-3xl font-black text-white mb-2 md:mb-3 leading-tight group-hover:text-[#18b5d5] transition-all duration-300 ${
                      isEven ? "md:self-start" : "md:self-start"
                    } self-center`}
                  >
                    {categoryProduct.category.name}
                  </h3>
                  <p
                    className={`text-[#ffffff]/75 mb-4 md:mb-8 text-sm sm:text-base leading-relaxed group-hover:text-white transition-all duration-300 line-clamp-3 ${
                      isEven ? "md:self-start md:text-left" : "md:self-end md:text-right"
                    } self-center text-center`}
                  >
                    {categoryProduct.category.description}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-4 ${
                    isEven ? "md:justify-start" : "md:justify-end"
                  } justify-center mt-auto w-full`}
                >
                  <button className="inline-flex items-center gap-2 md:gap-3 justify-center w-32 sm:w-36 md:w-44 h-10 sm:h-12 md:h-14 bg-[#18b5d5]/10 backdrop-blur-md border border-[#18b5d5]/50 text-[#18b5d5] text-sm md:text-base font-bold rounded-xl md:rounded-2xl hover:bg-[#18b5d5]/20 hover:shadow-lg hover:shadow-[#18b5d5]/40 transition-all duration-300 group-hover:scale-105">
                    اكتشف الخدمة
                  </button>
                </div>
              </div>

                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes card-reveal {
            0% { 
              opacity: 0; 
              transform: translateY(50px) scale(0.95);
            }
            50% {
              opacity: 0.5;
              transform: translateY(10px) scale(1.02);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 12s linear infinite; }
          .animate-pulse { animation: pulse 3s ease-in-out infinite; }
          .animate-card-reveal { animation: card-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .will-change-transform { will-change: transform, opacity; }
        `}</style>
      </div>
    </section>
  );
};

export default CategoriesSection;