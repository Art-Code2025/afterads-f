import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Users, Shield, Crown, HandshakeIcon, Medal, Award, Tag, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import logo from "../../assets/her.webp";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

  @keyframes smoothFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-10px) scale(1.02); }
  }
  
  @keyframes gentleGlow {
    0%, 100% { box-shadow: 0 4px 20px rgba(24, 181, 213, 0.15); }
    50% { box-shadow: 0 8px 30px rgba(24, 181, 213, 0.25); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(40px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0);
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

  @keyframes fadeSlideRight {
    from { 
      opacity: 0; 
      transform: translateX(-30px);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }

  @keyframes fadeSlideLeft {
    from { 
      opacity: 0; 
      transform: translateX(30px);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }
  
  .animate-smoothFloat { 
    animation: smoothFloat 8s ease-in-out infinite;
  }
  
  .animate-gentleGlow { 
    animation: gentleGlow 4s ease-in-out infinite;
  }
  
  .animate-slideUp {
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-fadeSlideRight {
    animation: fadeSlideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-fadeSlideLeft {
    animation: fadeSlideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #18b5d5 0%, #0ea5c4 25%, #18b5d5 50%, #0ea5c4 75%, #18b5d5 100%);
    background-size: 200% auto;
    animation: shimmer 4s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .smooth-hover {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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

// Counter Hook مُحسّن بانيميشن ناعم جداً
const useCountUp = (end: number, duration: number = 2500, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ultra smooth easing - مثل الزبدة
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

// Counter Component
interface AnimatedCounterProps {
  number: string;
  label: string;
  shouldAnimate: boolean;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ number, label, shouldAnimate, delay = 0 }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isNumeric = !isNaN(parseInt(number));
  const targetNumber = isNumeric ? parseInt(number) : 0;
  const suffix = isNumeric ? number.replace(/\d+/, '') : number;
  
  const count = useCountUp(targetNumber, 2500, startAnimation);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setStartAnimation(true), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay]);

  const displayValue = isNumeric ? `${count}${suffix}` : number;

  return (
    <div 
      className={`text-center bg-[#1f1f1f]/70 border border-[#18b5d5]/20 rounded-2xl lg:rounded-3xl p-4 lg:p-6 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/50 hover:scale-105 hover:shadow-xl hover:shadow-[#18b5d5]/20 group gpu-accelerate ${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
    >
      <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#18b5d5] mb-1 lg:mb-2 ultra-smooth group-hover:scale-110">
        {displayValue}
      </div>
      <div className="text-[#ffffff]/70 text-xs lg:text-sm ultra-smooth group-hover:text-[#ffffff]/90">
        {label}
      </div>
    </div>
  );
};

const AboutUsSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    { icon: Users, title: 'فريق خبراء', description: 'فريق من المطورين والمصممين ذوي الخبرة العالية' },
    { icon: Shield, title: 'ضمان الجودة', description: 'نضمن جودة عالية في جميع مشاريعنا مع اختبارات شاملة' },
    { icon: Crown, title: 'خدمة مميزة', description: 'دعم فني متواصل وخدمة عملاء استثنائية على مدار الساعة' },
    { icon: HandshakeIcon, title: 'تسليم سريع', description: 'التزام بالمواعيد المحددة وتسليم المشاريع في الوقت المناسب' },
    { icon: Medal, title: 'خبرة واسعة', description: 'سنوات من الخبرة في تطوير حلول تقنية متطورة ومبتكرة' },
    { icon: Award, title: 'معايير عالمية', description: 'نتبع أفضل الممارسات والمعايير العالمية في التطوير' },
    { icon: Tag, title: 'أسعار تنافسية', description: 'أسعار مناسبة وعروض مميزة تناسب جميع الميزانيات' },
    { icon: Zap, title: 'أداء متفوق', description: 'حلول سريعة ومحسنة للأداء مع أحدث التقنيات الحديثة' }
  ];

  const steps = [
    { 
      number: '01', 
      title: 'اكتشاف', 
      description: 'نفهم أهدافك وجمهورك ونحدد التحديات من البداية',
      details: ['تحليل المتطلبات', 'دراسة الجمهور المستهدف', 'تحديد الأهداف'] 
    },
    { 
      number: '02', 
      title: 'أسلوب', 
      description: 'تحديد اتجاه المشروع ونضع البصمة الإبداعية لهوية مشروعك',
      details: ['تصميم الهوية البصرية', 'اختيار الألوان والخطوط', 'وضع استراتيجية التصميم'] 
    },
    { 
      number: '03', 
      title: 'تخطيط', 
      description: 'نرسم خارطة طريق دقيقة للتصميم والتنفيذ',
      details: ['رسم المخططات التفصيلية', 'تحديد الجدول الزمني', 'توزيع المهام'] 
    },
    { 
      number: '04', 
      title: 'إبداع', 
      description: 'صياغة الرؤى التي تجلب أفكارك إلى الحياة',
      details: ['التصميم الإبداعي', 'تطوير النماذج الأولية', 'التفاعل والحركة'] 
    },
    { 
      number: '05', 
      title: 'تجميع', 
      description: 'نوحد كل العناصر ونجهزها للإطلاق بسلاسة',
      details: ['دمج جميع المكونات', 'الاختبار الشامل', 'التحسين والمراجعة'] 
    },
    { 
      number: '06', 
      title: 'إطلاق', 
      description: 'نشارك مشروعك مع العالم بثقة واحترافية',
      details: ['النشر المباشر', 'المتابعة والدعم', 'تحليل والتقييم'] 
    }
  ];

  const stats = [
    { number: '500+', label: 'مشروع مكتمل' },
    { number: '200+', label: 'عميل راضي' },
    { number: '5+', label: 'سنوات خبرة' },
    { number: '24/7', label: 'دعم فني' }
  ];

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.15 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Framer Motion Variants - ناعمة جداً
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="font-['Cairo']">
        {/* About Us Section */}
        <section ref={aboutRef} className="py-16 md:py-24 bg-[#292929] relative overflow-hidden">
          {/* خلفية انسيابية */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#292929] via-[#2d2d2d] to-[#292929]">
            {!isMobile && (
              <>
                <div className="absolute top-20 left-20 w-80 h-80 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat" style={{ animationDelay: '2s' }}></div>
              </>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* العنوان */}
            <motion.div variants={itemVariants} className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-4">
                  <span className="gradient-text">
                    AfterAds
                  </span>
                  <span className="text-white">
                    شريكك للنجاح الرقمي
                  </span>
                </div>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#ffffff]/80 max-w-4xl mx-auto leading-relaxed font-light px-4">
                وكالة سعودية رائدة في الحلول الرقمية والتسويق الإبداعي. 
                نحن صُنّاع <span className="text-[#18b5d5] font-semibold"> ثيم ملاك </span> 
                الأشهر والأكثر نجاحًا على منصة  <span className="font-bold">سلة</span>، ونفخر بكوننا الخيار الأول لأكبر العلامات التجارية في الخليج
              </p>
            </motion.div>

            {/* النص والخدمات + الصورة */}
            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 mt-6 lg:mt-12">
              {/* الخدمات */}
              <motion.div variants={itemVariants} className="flex-1 text-right flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">ماذا نقدم؟</h3>
                <p className="text-[#ffffff]/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 lg:mb-4">
                  نحن لا نقدّم خدمات فقط، بل نبني حلولًا متكاملة تصنع لك حضورًا رقميًا استثنائيًا:
                </p>
                <motion.ul 
                  className="space-y-2 lg:space-y-3 text-sm sm:text-base lg:text-lg text-[#ffffff]/90"
                  variants={containerVariants}
                >
                  {[
                    'استراتيجيات تسويق رقمي دقيقة تستهدف السوق الخليجي وتضاعف مبيعاتك.',
                    'تصميم هويات بصرية وواجهات استخدام عصرية تعكس قوة علامتك التجارية.',
                    'تطوير مواقع ومتاجر إلكترونية متكاملة مع أنظمة دفع وإدارة احترافية',
                    'برمجة تطبيقات موبايل عصرية تمنح عملاءك تجربة استخدام مميزة'
                  ].map((text, i) => (
                    <motion.li 
                      key={i}
                      variants={itemVariants}
                      className="bg-[#1f1f1f]/60 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border border-[#18b5d5]/10 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/30 hover:translate-x-[-4px] hover:shadow-lg hover:shadow-[#18b5d5]/10 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex items-center gpu-accelerate"
                    >
                      {text}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* الصورة */}
              <motion.div 
                variants={itemVariants}
                className="flex-1 relative flex items-center"
              >
                <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 h-[250px] sm:h-[300px] lg:h-[470px] group">
                  <img
                    src={logo}
                    alt="After Ads – فريقنا المبدع"
                    className="w-full h-full object-cover rounded-2xl lg:rounded-3xl border border-[#18b5d5]/30 shadow-lg shadow-[#18b5d5]/10 ultra-smooth group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#18b5d5]/20 gpu-accelerate"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#18b5d5]/10 to-[#0d8aa3]/10 rounded-2xl lg:rounded-3xl opacity-0 ultra-smooth group-hover:opacity-100"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={servicesRef} className="py-16 md:py-24 bg-[#292929] relative overflow-hidden">
          {/* خلفية انسيابية */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d2d] via-[#292929] to-[#2d2d2d]">
            {!isMobile && (
              <>
                <div className="absolute top-40 right-40 w-96 h-96 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 bg-[#18b5d5]/5 rounded-full blur-3xl animate-smoothFloat" style={{ animationDelay: '3s' }}></div>
              </>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div variants={itemVariants} className="text-center mb-8 lg:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-6 leading-tight">
                نحن <span className="gradient-text">الخيار الأمثل</span> لمشروعك
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#ffffff]/80 max-w-3xl mx-auto leading-relaxed font-light px-4">
                نجمع بين الخبرة والإبداع لنقدم لك حلولاً تقنية متميزة تساعدك على تحقيق أهدافك
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-16"
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-[#1f1f1f]/60 border border-[#18b5d5]/20 rounded-xl lg:rounded-2xl p-3 lg:p-5 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/40 hover:scale-105 hover:shadow-xl hover:shadow-[#18b5d5]/20 gpu-accelerate">
                      <div className="text-center">
                        <div className="relative mb-2 lg:mb-4 mx-auto w-fit">
                          <div className="w-10 h-10 lg:w-14 lg:h-14 bg-[#18b5d5]/10 border border-[#18b5d5]/20 rounded-lg flex items-center justify-center ultra-smooth group-hover:bg-[#18b5d5]/20 group-hover:scale-110 group-hover:rotate-3">
                            <IconComponent className="w-5 h-5 lg:w-7 lg:h-7 text-[#18b5d5] ultra-smooth group-hover:text-white" />
                          </div>
                        </div>
                        <h3 className="text-sm lg:text-base font-black text-white mb-1 lg:mb-2 ultra-smooth group-hover:text-[#18b5d5]">
                          {feature.title}
                        </h3>
                        <p className="text-[#ffffff]/70 text-xs leading-relaxed ultra-smooth group-hover:text-[#ffffff]/90">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-6 lg:mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white">
                اعمل معنا إذا كنت ترغب في:
              </h2>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="text-center space-y-2 lg:space-y-4 mb-8 lg:mb-16 px-4"
            >
              {[
                'بناء حضور رقمي يواكب طموحاتك ويعكس قوة علامتك.',
                'الوصول إلى عملاءك بطريقة أذكى من خلال حلول تسويق فعّالة.',
                'تحويل فكرتك إلى علامة تجارية تترك بصمة حقيقية.',
                'نمو متواصل قائم على حلول تقنية مبتكرة واستراتيجيات مدروسة.'
              ].map((sentence, index) => (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-[#18b5d5] max-w-3xl mx-auto leading-relaxed font-semibold relative group cursor-default"
                >
                  <span className="absolute inset-0 bg-[#18b5d5]/10 rounded-lg blur-sm opacity-50 ultra-smooth group-hover:opacity-70 group-hover:blur-md"></span>
                  <span className="relative">{sentence}</span>
                </motion.p>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              ref={statsRef}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-12 lg:mb-20"
            >
              {stats.map((stat, index) => (
                <AnimatedCounter
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  shouldAnimate={statsInView}
                  delay={index * 150}
                />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 lg:mt-32">
              <div className="text-center mb-8 lg:mb-16">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 lg:mb-6">
                  رحلة <span className="gradient-text">مشروعك</span> معنا
                </h3>
                <p className="text-[#ffffff]/80 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed px-4">
                  منهجية احترافية مُحكمة من ست خطوات لضمان نجاح مشروعك وتحقيق رؤيتك
                </p>
              </div>

              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group cursor-pointer"
                  >
                    <div className="relative mb-4 lg:mb-6 z-10">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-[#1f1f1f]/60 border-2 border-[#18b5d5]/20 rounded-full flex flex-col items-center justify-center ultra-smooth group-hover:bg-[#1f1f1f] group-hover:border-[#18b5d5]/50 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#18b5d5]/30 mx-auto gpu-accelerate">
                        <span className="text-sm lg:text-lg xl:text-2xl font-black text-[#18b5d5] mb-1 ultra-smooth group-hover:text-white group-hover:scale-110">
                          {step.number}
                        </span>
                        <span className="text-xs lg:text-sm font-black text-white ultra-smooth group-hover:text-[#18b5d5]">
                          {step.title}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[#ffffff]/70 text-xs leading-relaxed ultra-smooth group-hover:text-[#ffffff]/90">
                        {step.description}
                      </p>
                      <div className="mt-2 lg:mt-3 space-y-1 max-h-0 opacity-0 overflow-hidden ultra-smooth group-hover:max-h-40 group-hover:opacity-100">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center justify-center gap-1 text-xs text-[#ffffff]/80">
                            <CheckCircle className="w-3 h-3 text-[#18b5d5]/80 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-12 lg:mt-20 px-4">
              <div className="bg-[#1f1f1f]/60 border border-[#18b5d5]/20 rounded-2xl lg:rounded-3xl p-6 lg:p-8 ultra-smooth hover:bg-[#1f1f1f] hover:border-[#18b5d5]/40 hover:shadow-2xl hover:shadow-[#18b5d5]/20 max-w-4xl mx-auto group gpu-accelerate">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
                  <div className="text-center md:text-right flex-1">
                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 lg:mb-4 ultra-smooth group-hover:text-[#18b5d5]">
                      مستعد لبدء مشروعك؟
                    </h3>
                    <p className="text-[#ffffff]/70 text-base lg:text-lg leading-relaxed ultra-smooth group-hover:text-[#ffffff]/90">
                      دعنا نحول أفكارك إلى واقع رقمي مذهل بأحدث التقنيات والمعايير العالمية
                    </p>
                  </div>
                  <Link
                    to="/categories"
                    aria-label="ابدأ مشروعك الآن"
                    className="inline-flex items-center gap-2 lg:gap-3 justify-center bg-[#18b5d5]/20 border border-[#18b5d5]/50 text-[#18b5d5] text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl px-6 lg:px-10 py-3 lg:py-4 ultra-smooth hover:bg-[#18b5d5]/30 hover:shadow-xl hover:shadow-[#18b5d5]/30 hover:scale-105 hover:-translate-y-1 group/btn gpu-accelerate"
                  >
                    ابدأ الآن
                    <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-[#18b5d5] ultra-smooth group-hover/btn:translate-x-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default AboutUsSection;