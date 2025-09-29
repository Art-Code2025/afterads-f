import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Users, Shield, Crown, HandshakeIcon, Medal, Award, Tag, Zap, ArrowRight, CheckCircle, Heart } from 'lucide-react';
import logo from "../../assets/her.webp";
import { Link } from "react-router-dom";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

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
  @keyframes counter-glow {
    0%, 100% { 
      text-shadow: 0 0 10px rgba(24, 181, 213, 0.5);
    }
    50% { 
      text-shadow: 0 0 20px rgba(24, 181, 213, 0.8), 0 0 30px rgba(24, 181, 213, 0.6);
    }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }
  .animate-pulse { animation: pulse 3s ease-in-out infinite; }
  .animate-card-reveal { animation: card-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .animate-counter-glow { animation: counter-glow 2s ease-in-out infinite; }
  .will-change-transform { will-change: transform, opacity; }
`;

// Counter Hook للعد التدريجي
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOut animation curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsComplete(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return { count, isComplete };
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
  const isNumeric = !isNaN(parseInt(number));
  const targetNumber = isNumeric ? parseInt(number) : 0;
  const suffix = isNumeric ? number.replace(/\d+/, '') : number;
  
  const { count, isComplete } = useCountUp(targetNumber, 2000, startAnimation);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay]);

  const displayValue = isNumeric ? `${count}${suffix}` : number;

  return (
    <div className="text-center bg-[#ffffff]/10 backdrop-blur-md border border-[#18b5d5]/30 rounded-2xl lg:rounded-3xl p-4 lg:p-6 hover:bg-[#ffffff]/20 hover:border-[#18b5d5]/50 transition-all duration-300 hover:scale-105 group">
      <div className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#18b5d5] mb-1 lg:mb-2 group-hover:scale-110 transition-all duration-300 ${
        startAnimation && !isComplete ? 'animate-counter-glow' : ''
      }`}>
        {displayValue}
      </div>
      <div className="text-[#ffffff]/80 text-xs lg:text-sm group-hover:text-white transition-colors duration-300">
        {label}
      </div>
      
    </div>
  );
};

const AboutUsSection = () => {
  const features = [
    { icon: Users, title: 'فريق خبراء', description: 'فريق من المطورين والمصممين ذوي الخبرة العالية ' },
    { icon: Shield, title: 'ضمان الجودة', description: 'نضمن جودة عالية في جميع مشاريعنا مع اختبارات شاملة' },
    { icon: Crown, title: 'خدمة مميزة', description: 'دعم فني متواصل وخدمة عملاء استثنائية على مدار الساعة' },
    { icon: HandshakeIcon, title: 'تسليم سريع', description: 'التزام بالمواعيد المحددة وتسليم المشاريع في الوقت المناسب' },
    { icon: Medal, title: 'خبرة واسعة', description: 'سنوات من الخبرة في تطوير حلول تقنية متطورة ومبتكرة' },
    { icon: Award, title: 'معايير عالمية', description: 'نتبع أفضل الممارسات والمعايير العالمية في التطوير' },
    { icon: Tag, title: 'أسعار تنافسية', description: 'أسعار مناسبة وعروض مميزة تناسب جميع الميزانيات' },
    { icon: Zap, title: 'أداء متفوق', description: '  حلول سريعة ومحسنة للأداء مع أحدث التقنيات الحديثة' }
  ];

  const steps = [
    { number: '01', title: 'اكتشاف', description: 'نفهم أهدافك وجمهورك ونحدد التحديات من البداية',
      details: ['تحليل المتطلبات', 'دراسة الجمهور المستهدف', 'تحديد الأهداف'] },
    { number: '02', title: 'أسلوب', description: 'تحديد اتجاه المشروع ونضع البصمة الإبداعية لهوية مشروعك',
      details: ['تصميم الهوية البصرية', 'اختيار الألوان والخطوط', 'وضع استراتيجية التصميم'] },
    { number: '03', title: 'تخطيط', description: 'نرسم خارطة طريق دقيقة للتصميم والتنفيذ',
      details: ['رسم المخططات التفصيلية', 'تحديد الجدول الزمني', 'توزيع المهام'] },
    { number: '04', title: 'إبداع', description: 'صياغة الرؤى التي تجلب أفكارك إلى الحياة',
      details: ['التصميم الإبداعي', 'تطوير النماذج الأولية', 'التفاعل والحركة'] },
    { number: '05', title: 'تجميع', description: 'نوحد كل العناصر ونجهزها للإطلاق بسلاسة',
      details: ['دمج جميع المكونات', 'الاختبار الشامل', 'التحسين والمراجعة'] },
    { number: '06', title: 'إطلاق', description: 'نشارك مشروعك مع العالم بثقة واحترافية',
      details: ['النشر المباشر', 'المتابعة والدعم', 'تحليل والتقييم'] }
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
  const cardRefs = useRef(new Map());
  const aboutControls = useAnimation();
  const servicesControls = useAnimation();
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.1 });
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.1 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (aboutInView) {
      aboutControls.start('visible');
    }
    if (servicesInView) {
      servicesControls.start('visible');
      Array.from(cardRefs.current.entries()).forEach(([index, card]) => {
        setTimeout(() => {
          card.classList.add('animate-card-reveal');
          card.classList.remove('opacity-0', 'scale-95');
        }, index * 100);
      });
    }
  }, [aboutInView, servicesInView, aboutControls, servicesControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const sentenceVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="font-['Cairo']">
{/* About Us Section */}
<section ref={aboutRef} className="py-24 bg-[#292929] relative overflow-hidden">
  <div className="absolute inset-0 backdrop-blur-3xl">
    <div className="absolute inset-0 bg-gradient-to-br from-[#292929]/80 via-[#333333]/80 to-[#292929]/80"></div>
  </div>

  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate={aboutControls}
    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    {/* العنوان */}
    <motion.div variants={childVariants} className="text-center mb-8 md:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18b5d5] to-[#0d8aa3] animate-pulse">
            AfterAds
          </span>
          <span className="text-white">
            شريكك للنجاح الرقمي
          </span>
        </div>
      </h2>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#ffffff]/80 max-w-4xl mx-auto leading-relaxed font-light px-4">
        وكالة سعودية رائدة في الحلول الرقمية والتسويق الإبداعي. 
        نحن صُنّاع <span className="text-[#18b5d5] font-semibold">ثيم ملاك </span> 
        الأشهر والأكثر نجاحًا على منصة <span className="font-bold">سلة</span>، ونفخر بكوننا الخيار الأول لأكبر العلامات التجارية في الخليج
      </p>
    </motion.div>

    {/* النص والخدمات + الصورة */}
    <motion.div
      variants={childVariants}
      className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 mt-6 lg:mt-12"
    >
      {/* الخدمات */}
      <motion.div variants={childVariants} className="flex-1 text-right flex flex-col justify-center">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">ماذا نقدم؟</h3>
        <p className="text-[#ffffff]/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 lg:mb-4">
          نحن لا نقدّم خدمات فقط، بل نبني حلولًا متكاملة تصنع لك حضورًا رقميًا استثنائيًا:
        </p>
        <ul className="space-y-2 lg:space-y-3 text-sm sm:text-base lg:text-lg text-[#ffffff]/90">
          <li className="bg-[#1f1f1f] px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border border-[#18b5d5]/20 hover:bg-[#222] transition min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex items-center">
            استراتيجيات تسويق رقمي دقيقة تستهدف السوق الخليجي وتضاعف مبيعاتك.
          </li>
          <li className="bg-[#1f1f1f] px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border border-[#18b5d5]/20 hover:bg-[#222] transition min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex items-center">
            تصميم هويات بصرية وواجهات استخدام عصرية تعكس قوة علامتك التجارية.
          </li>
          <li className="bg-[#1f1f1f] px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border border-[#18b5d5]/20 hover:bg-[#222] transition min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex items-center">
            تطوير مواقع ومتاجر إلكترونية متكاملة مع أنظمة دفع وإدارة احترافية
          </li>
          <li className="bg-[#1f1f1f] px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border border-[#18b5d5]/20 hover:bg-[#222] transition min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] flex items-center">
            برمجة تطبيقات موبايل عصرية تمنح عملاءك تجربة استخدام مميزة
          </li>
        </ul>
      </motion.div>

      {/* الصورة */}
      <motion.div variants={imageVariants} className="flex-1 relative flex items-center">
        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 h-[250px] sm:h-[300px] lg:h-[470px]">
          <img
            src={logo}
            alt="After Ads – فريقنا المبدع"
            className="w-full h-full object-cover rounded-2xl lg:rounded-3xl border border-[#18b5d5]/30 shadow-lg shadow-[#18b5d5]/20 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18b5d5]/20 to-[#0d8aa3]/20 rounded-2xl lg:rounded-3xl blur-md opacity-80 hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
</section>

        {/* Why Choose Us Section */}
        <section ref={servicesRef} data-section="services" className="py-24 bg-[#292929] relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#292929]/80 via-[#333333]/80 to-[#292929]/80"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 text-[#18b5d5]/80 font-mono text-sm animate-float filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
                &lt;section className="services"&gt;
              </div>
              <div className="absolute top-40 right-20 text-[#18b5d5]/50 font-mono text-xs animate-float-delayed filter drop-shadow-[0_0_8px_rgba(24,181,213,0.3)]">
                const services = () =&gt; {}
              </div>
              <div className="absolute bottom-60 left-32 text-[#18b5d5]/70 font-mono text-sm animate-float-slow filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
                useState([data, setData])
              </div>
              <div className="absolute bottom-32 right-10 text-[#18b5d5]/40 font-mono text-xs animate-bounce-slow filter drop-shadow-[0_0_8px_rgba(24,181,213,0.3)]">
                API.optimize.SEO();
              </div>
              <div className="absolute top-80 left-1/2 text-[#18b5d5]/60 font-mono text-sm animate-pulse filter drop-shadow-[0_0_10px_rgba(24,181,213,0.4)]">
                fetch('/services').then()
              </div>
            </div>
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-[#18b5d5]/60 rounded-full filter blur-md ${
                    i % 2 === 0 ? 'animate-pulse' : 'animate-ping'
                  } drop-shadow-[0_0_15px_rgba(24,181,213,0.6)]`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    opacity: Math.random() * 0.5 + 0.4
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesControls}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div variants={childVariants} className="text-center mb-8 lg:mb-16">
             
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-6 leading-tight">
                نحن <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18b5d5] to-[#0d8aa3] animate-pulse">الخيار الأمثل</span> لمشروعك
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#ffffff]/80 max-w-3xl mx-auto leading-relaxed font-light px-4">
                نجمع بين الخبرة والإبداع لنقدم لك حلولاً تقنية متميزة تساعدك على تحقيق أهدافك
              </p>
            </motion.div>

            <motion.div variants={childVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-16">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={childVariants}
                    className="will-change-transform transition-all duration-700 group cursor-pointer flex-1"
                  >
                    <div className="relative bg-[#ffffff]/10 backdrop-blur-lg border border-[#18b5d5]/30 rounded-xl lg:rounded-2xl p-3 lg:p-5 hover:border-[#18b5d5]/50 hover:shadow-[#18b5d5]/30 transition-all duration-500 hover:scale-105">
                      <div className="relative z-10 text-center">
                        <div className="relative mb-2 lg:mb-4 mx-auto w-fit">
                          <div className="w-10 h-10 lg:w-14 lg:h-14 bg-[#ffffff]/10 backdrop-blur-md border border-[#18b5d5]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-5 h-5 lg:w-7 lg:h-7 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                        <h3 className="text-sm lg:text-base font-black text-white mb-1 lg:mb-2 group-hover:text-[#18b5d5] transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-[#ffffff]/80 text-xs leading-relaxed group-hover:text-white transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div variants={childVariants} className="text-center mb-6 lg:mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-lg">
                اعمل معنا إذا كنت ترغب في:
              </h2>
            </motion.div>

            <motion.div variants={childVariants} className="text-center space-y-2 lg:space-y-4 mb-8 lg:mb-16 px-4">
              {[
                'بناء حضور رقمي يواكب طموحاتك ويعكس قوة علامتك.',
                'الوصول إلى عملاءك بطريقة أذكى من خلال حلول تسويق فعّالة.',
                'تحويل فكرتك إلى علامة تجارية تترك بصمة حقيقية.',
                'نمو متواصل قائم على حلول تقنية مبتكرة واستراتيجيات مدروسة.'
              ].map((sentence, index) => (
                <motion.p
                  key={index}
                  variants={sentenceVariants}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-[#18b5d5] max-w-3xl mx-auto leading-relaxed font-semibold relative"
                >
                  <span className="absolute inset-0 bg-[#18b5d5]/20 rounded-lg blur-md opacity-50"></span>
                  <span className="relative">{sentence}</span>
                </motion.p>
              ))}
            </motion.div>

            {/* Enhanced Stats Section with Counter Animation */}
            <motion.div 
              ref={statsRef}
              variants={childVariants} 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-12 lg:mb-20"
            >
              {stats.map((stat, index) => (
                <AnimatedCounter
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  shouldAnimate={statsInView}
                  delay={index * 200}
                />
              ))}
            </motion.div>

            <motion.div variants={childVariants} className="mt-16 lg:mt-32">
              <div className="text-center mb-8 lg:mb-16">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 lg:mb-6">
                  رحلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18b5d5] to-[#0d8aa3]">مشروعك</span> معنا
                </h3>
                <p className="text-[#ffffff]/80 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed px-4">
                  منهجية احترافية مُحكمة من ست خطوات لضمان نجاح مشروعك وتحقيق رؤيتك
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el) => el && cardRefs.current.set(index + features.length + 4, el)}
                    className="opacity-100 scale-100 will-change-transform transition-all duration-700 group cursor-pointer"
                  >
                    <div className="relative mb-4 lg:mb-6 z-10">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-[#ffffff]/10 backdrop-blur-2xl border-2 border-[#18b5d5]/30 rounded-full flex flex-col items-center justify-center group-hover:bg-[#ffffff]/20 group-hover:border-[#18b5d5]/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#18b5d5]/40 mx-auto">
                        <span className="text-sm lg:text-lg xl:text-2xl font-black text-[#18b5d5] mb-1 group-hover:text-white transition-colors duration-300">
                          {step.number}
                        </span>
                        <span className="text-xs lg:text-sm font-black text-white group-hover:text-[#18b5d5] transition-colors duration-300">
                          {step.title}
                        </span>
                      </div>
                      <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-gradient-to-r from-[#18b5d5]/80 to-[#0d8aa3]/80 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 will-change-opacity z-[-2] mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-[#ffffff]/80 text-xs leading-relaxed group-hover:text-white transition-colors duration-300">
                        {step.description}
                      </p>
                      <div className="mt-2 lg:mt-3 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center justify-center gap-1 text-xs text-[#ffffff]/80">
                            <CheckCircle className="w-3 h-3 text-[#18b5d5]/80 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </motion.div>

            <motion.div variants={childVariants} className="text-center mt-12 lg:mt-20 px-4">
              <div className="bg-[#ffffff]/10 backdrop-blur-xl border border-[#18b5d5]/30 rounded-2xl lg:rounded-3xl p-6 lg:p-8 hover:bg-[#ffffff]/20 hover:border-[#18b5d5]/50 transition-all duration-500 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
                  <div className="text-center md:text-right flex-1">
                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 lg:mb-4">مستعد لبدء مشروعك؟</h3>
                    <p className="text-[#ffffff]/80 text-base lg:text-lg leading-relaxed">
                      دعنا نحول أفكارك إلى واقع رقمي مذهل بأحدث التقنيات والمعايير العالمية
                    </p>
                  </div>
                 <Link
                  to="/categories"
                  aria-label="ابدأ مشروعك الآن"
                  className="inline-flex items-center gap-2 lg:gap-3 justify-center bg-[#18b5d5]/10 backdrop-blur-md border border-[#18b5d5]/50 text-[#18b5d5] text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl px-6 lg:px-10 py-3 lg:py-4 hover:bg-[#18b5d5]/20 hover:shadow-lg hover:shadow-[#18b5d5]/40 transition-all duration-300 hover:scale-105 group"
                >
                  ابدأ الآن
                  <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-[#18b5d5] group-hover:translate-x-1 transition-transform duration-300" />
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