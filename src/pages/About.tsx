import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Rocket, 
  Heart, 
  Star, 
  CheckCircle, 
  Users, 
  Zap, 
  TrendingUp, 
  Code, 
  Palette, 
  ShoppingCart,
  Award,
  Globe,
  Clock,
  ArrowRight,
  ArrowLeft,
  ThumbsUp
} from 'lucide-react';

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vision');

  // Add animations and responsive styles
  const fadeInUpStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .animate-slideInRight {
      animation: slideInRight 0.6s ease-out;
    }
    
    .animate-scaleIn {
      animation: scaleIn 0.6s ease-out;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    /* Mobile responsive styles */
    @media (max-width: 640px) {
      .mobile-text-xs { font-size: 0.75rem; }
      .mobile-text-sm { font-size: 0.875rem; }
      .mobile-text-base { font-size: 1rem; }
      .mobile-text-lg { font-size: 1.125rem; }
      .mobile-text-xl { font-size: 1.25rem; }
      .mobile-text-2xl { font-size: 1.5rem; }
      .mobile-text-3xl { font-size: 1.875rem; }
      .mobile-text-4xl { font-size: 2.25rem; }
      .mobile-p-2 { padding: 0.5rem; }
      .mobile-p-3 { padding: 0.75rem; }
      .mobile-p-4 { padding: 1rem; }
      .mobile-p-6 { padding: 1.5rem; }
      .mobile-px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .mobile-px-4 { padding-left: 1rem; padding-right: 1rem; }
      .mobile-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .mobile-py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .mobile-m-2 { margin: 0.5rem; }
      .mobile-mb-3 { margin-bottom: 0.75rem; }
      .mobile-mb-4 { margin-bottom: 1rem; }
      .mobile-mb-6 { margin-bottom: 1.5rem; }
      .mobile-mt-4 { margin-top: 1rem; }
      .mobile-gap-2 { gap: 0.5rem; }
      .mobile-gap-3 { gap: 0.75rem; }
      .mobile-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .mobile-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    @media (max-width: 480px) {
      .ultra-mobile-text-xs { font-size: 0.7rem; }
      .ultra-mobile-text-sm { font-size: 0.8rem; }
      .ultra-mobile-text-base { font-size: 0.9rem; }
      .ultra-mobile-text-lg { font-size: 1rem; }
      .ultra-mobile-text-xl { font-size: 1.1rem; }
      .ultra-mobile-text-2xl { font-size: 1.3rem; }
      .ultra-mobile-text-3xl { font-size: 1.6rem; }
      .ultra-mobile-p-2 { padding: 0.4rem; }
      .ultra-mobile-p-3 { padding: 0.6rem; }
      .ultra-mobile-p-4 { padding: 0.8rem; }
      .ultra-mobile-px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .ultra-mobile-px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .ultra-mobile-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .ultra-mobile-mb-2 { margin-bottom: 0.5rem; }
      .ultra-mobile-mb-3 { margin-bottom: 0.75rem; }
      .ultra-mobile-mb-4 { margin-bottom: 1rem; }
      .ultra-mobile-gap-1 { gap: 0.25rem; }
      .ultra-mobile-gap-2 { gap: 0.5rem; }
    }
  `;

  const stats = [
    { number: '500+', label: 'مشروع مكتمل', icon: <Award className="w-8 h-8" /> },
    { number: '200+', label: 'عميل راضي', icon: <ThumbsUp className="w-8 h-8" /> },
    { number: '5+', label: 'سنوات خبرة', icon: <Clock className="w-8 h-8" /> },
    { number: '15+', label: 'دولة نخدمها', icon: <Globe className="w-8 h-8" /> }
  ];

  const services = [
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'التسويق الرقمي',
      description: 'استراتيجيات تسويقية متطورة لزيادة المبيعات والوصول للجمهور المستهدف'
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: 'برمجة المواقع',
      description: 'تطوير مواقع وتطبيقات ويب عالية الأداء باستخدام أحدث التقنيات'
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: 'التصميم الإبداعي',
      description: 'تصميم هويات بصرية مميزة وواجهات مستخدم جذابة وسهلة الاستخدام'
    },
    {
      icon: <ShoppingCart className="w-12 h-12" />,
      title: 'التجارة الإلكترونية',
      description: 'بناء متاجر إلكترونية متكاملة مع أنظمة دفع آمنة وإدارة مخزون متطورة'
    }
  ];

  const teamMembers = [
    {
      name: 'أحمد محمد',
      role: 'مدير التطوير',
      image: '/api/placeholder/150/150',
      description: 'خبير في تطوير التطبيقات والمواقع الإلكترونية'
    },
    {
      name: 'فاطمة أحمد',
      role: 'مديرة التصميم',
      image: '/api/placeholder/150/150',
      description: 'متخصصة في تصميم واجهات المستخدم والهويات البصرية'
    },
    {
      name: 'محمد علي',
      role: 'مدير التسويق',
      image: '/api/placeholder/150/150',
      description: 'خبير في استراتيجيات التسويق الرقمي ووسائل التواصل الاجتماعي'
    },
    {
      name: 'سارة محمود',
      role: 'مديرة المشاريع',
      image: '/api/placeholder/150/150',
      description: 'متخصصة في إدارة المشاريع وضمان جودة التسليم'
    }
  ];

  const testimonials = [
    {
      name: 'عبدالله السعيد',
      text: 'فريق محترف ومتميز، ساعدونا في تطوير موقعنا الإلكتروني وزيادة مبيعاتنا بشكل كبير',
      rating: 5
    },
    {
      name: 'مريم الأحمد',
      text: 'خدمة عملاء ممتازة وجودة عالية في التصميم والتطوير، أنصح بالتعامل معهم',
      rating: 5
    },
    {
      name: 'خالد محمد',
      text: 'تم تطوير متجرنا الإلكتروني بطريقة احترافية وفي الوقت المحدد، شكراً لكم',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      <style>{fadeInUpStyle}</style>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(122, 122, 122, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(122, 122, 122, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#7a7a7a]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#7a7a7a]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-[#7a7a7a]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 mt-[60px] sm:mt-[70px] lg:mt-[80px] mobile-px-3 ultra-mobile-px-2">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-scaleIn">
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 animate-float">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/20 to-[#292929]/10 backdrop-blur-md border border-[#7a7a7a]/30 transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_10px_rgba(122,122,122,0.8)] flex-shrink-0" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mobile-text-3xl ultra-mobile-text-2xl">
              وكالة  <span className="text-[#7a7a7a] block sm:inline">AfterAds</span>
            </h1>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 hidden sm:block">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/30 blur-sm transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/20 to-[#292929]/10 backdrop-blur-md border border-[#7a7a7a]/30 transform rotate-0 transition-all duration-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_10px_rgba(122,122,122,0.8)] flex-shrink-0" />
              </div>
            </div>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed mobile-text-lg ultra-mobile-text-base animate-fadeInUp">
            نحن متخصصون في تقديم حلول رقمية شاملة ومبتكرة تساعد الشركات على النمو والازدهار في العصر الرقمي
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18b5d5] text-center mb-8 sm:mb-10 lg:mb-12 mobile-text-2xl ultra-mobile-text-xl animate-slideInRight">خدماتنا المتميزة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mobile-grid-cols-1">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/20 to-[#292929]/90 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/10 p-4 sm:p-6 text-center hover:transform hover:scale-105 transition-all duration-300 animate-scaleIn mobile-p-4 ultra-mobile-p-3">
                <div className="text-[#7a7a7a] mx-auto mb-3 sm:mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3 mobile-text-base ultra-mobile-text-sm">{service.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mobile-text-sm ultra-mobile-text-xs">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16 lg:mb-20 mobile-p-4 ultra-mobile-p-3 animate-fadeInUp">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] text-center mb-6 sm:mb-8 mobile-text-xl ultra-mobile-text-lg">إنجازاتنا بالأرقام</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mobile-grid-cols-2">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scaleIn">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="text-[#7a7a7a] flex-shrink-0">{stat.icon}</div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 mobile-text-2xl ultra-mobile-text-xl">{stat.number}</div>
                <div className="text-gray-100 font-medium text-xs sm:text-sm lg:text-base mobile-text-sm ultra-mobile-text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision/Mission/Values Tabs */}
        <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16 lg:mb-20 mobile-p-4 ultra-mobile-p-3 animate-slideInRight">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="lg:w-1/3">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { id: 'vision', title: 'رؤيتنا', icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
                  { id: 'mission', title: 'مهمتنا', icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
                  { id: 'values', title: 'قيمنا', icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 mobile-p-3 ultra-mobile-p-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white'
                        : 'text-gray-100 hover:bg-[#7a7a7a]/20'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-bold text-base sm:text-lg mobile-text-base ultra-mobile-text-sm">{tab.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="bg-[#292929]/50 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 mobile-p-4 ultra-mobile-p-3">
                {activeTab === 'vision' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 mobile-text-xl ultra-mobile-text-lg">رؤيتنا للمستقبل</h3>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-100 leading-relaxed mb-4 sm:mb-6 mobile-text-base ultra-mobile-text-sm">
                      نسعى لأن نكون الوكالة الرقمية الرائدة في المنطقة، التي تساعد الشركات على تحقيق نجاحات استثنائية من خلال الحلول التقنية المبتكرة والإبداعية.
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed mobile-text-sm ultra-mobile-text-xs">
                      نؤمن بأن كل مشروع يحمل قصة فريدة، ونحن هنا لنساعدك في سردها بطريقة تأسر الجمهور وتحقق أهدافك.
                    </p>
                  </div>
                )}
                {activeTab === 'mission' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 mobile-text-xl ultra-mobile-text-lg">مهمتنا المقدسة</h3>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-100 leading-relaxed mb-4 sm:mb-6 mobile-text-base ultra-mobile-text-sm">
                      توفير حلول رقمية شاملة ومتطورة تمكن عملائنا من التميز في السوق الرقمي وتحقيق نمو مستدام وملحوظ.
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        "تطوير استراتيجيات تسويقية فعالة",
                        "بناء مواقع وتطبيقات عالية الجودة",
                        "تصميم هويات بصرية مميزة",
                        "إنشاء منصات تجارية ناجحة"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3 animate-slideInRight">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#7a7a7a] flex-shrink-0" />
                          <span className="text-sm sm:text-base lg:text-lg text-gray-200 mobile-text-sm ultra-mobile-text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'values' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 mobile-text-xl ultra-mobile-text-lg">قيمنا الأساسية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mobile-grid-cols-1">
                      <div className="bg-[#7a7a7a]/10 rounded-lg p-4 sm:p-6 mobile-p-4 ultra-mobile-p-3 animate-scaleIn">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#7a7a7a] flex-shrink-0" />
                          <h4 className="text-lg sm:text-xl font-bold text-white mobile-text-lg ultra-mobile-text-base">الإبداع</h4>
                        </div>
                        <p className="text-gray-200 text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">نسعى دائماً لتقديم حلول مبتكرة وإبداعية تتجاوز التوقعات</p>
                      </div>
                      <div className="bg-[#7a7a7a]/10 rounded-lg p-4 sm:p-6 mobile-p-4 ultra-mobile-p-3 animate-scaleIn">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#7a7a7a] flex-shrink-0" />
                          <h4 className="text-lg sm:text-xl font-bold text-white mobile-text-lg ultra-mobile-text-base">الجودة</h4>
                        </div>
                        <p className="text-gray-200 text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">نلتزم بأعلى معايير الجودة في كل تفصيل من تفاصيل عملنا</p>
                      </div>
                      <div className="bg-[#7a7a7a]/10 rounded-lg p-4 sm:p-6 mobile-p-4 ultra-mobile-p-3 animate-scaleIn">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#7a7a7a] flex-shrink-0" />
                          <h4 className="text-lg sm:text-xl font-bold text-white mobile-text-lg ultra-mobile-text-base">التعاون</h4>
                        </div>
                        <p className="text-gray-200 text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">نؤمن بقوة العمل الجماعي والشراكة الحقيقية مع عملائنا</p>
                      </div>
                      <div className="bg-[#7a7a7a]/10 rounded-lg p-4 sm:p-6 mobile-p-4 ultra-mobile-p-3 animate-scaleIn">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#7a7a7a] flex-shrink-0" />
                          <h4 className="text-lg sm:text-xl font-bold text-white mobile-text-lg ultra-mobile-text-base">السرعة</h4>
                        </div>
                        <p className="text-gray-200 text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">نقدر أهمية الوقت ونسعى لتقديم النتائج في المواعيد المحددة</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        

        {/* Testimonials Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18b5d5] text-center mb-8 sm:mb-10 lg:mb-12 mobile-text-2xl ultra-mobile-text-xl animate-fadeInUp">آراء عملائنا</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mobile-grid-cols-1">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/20 to-[#292929]/90 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/10 p-4 sm:p-6 mobile-p-4 ultra-mobile-p-3 animate-slideInRight">
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-100 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">"{testimonial.text}"</p>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs">{testimonial.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#7a7a7a]/20 via-[#292929]/90 to-[#7a7a7a]/20 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 lg:p-12 text-center mobile-p-6 ultra-mobile-p-4 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18b5d5] mb-4 sm:mb-6 mobile-text-2xl ultra-mobile-text-xl">هل أنت مستعد لبدء مشروعك؟</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed mobile-text-base ultra-mobile-text-sm">
            انضم إلى مئات العملاء الذين وثقوا بنا لتطوير أعمالهم الرقمية. دعنا نساعدك في تحقيق أهدافك وتحويل رؤيتك إلى واقع رقمي مذهل.
          </p>
    
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          
            <div className="text-center animate-fadeInUp">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-[#8a8a8a] hover:to-[#5a5a5a] transition-all duration-300 transform hover:scale-105 font-bold shadow-lg text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs"
              >
              ابدأ مشروعك الآن
              </Link>
            </div>
            
             {/* Back Button */}
            <div className="text-center animate-fadeInUp">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-[#8a8a8a] hover:to-[#5a5a5a] transition-all duration-300 transform hover:scale-105 font-bold shadow-lg text-sm sm:text-base mobile-text-sm ultra-mobile-text-xs"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
             

           
          
        </div>
      </div>
    </div>
  );
};

export default About;