import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft,ArrowRight, Mail, Phone, Calendar, User, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden" dir="rtl">
      <style>
        {`
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
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
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
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-slideInRight {
            animation: slideInRight 0.7s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-pulse {
            animation: pulse 4s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.25;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.35;
            }
          }

          .animate-pulse-delay-1 {
            animation-delay: 1s;
          }

          .animate-pulse-delay-05 {
            animation-delay: 0.5s;
          }

          /* Mobile-specific responsive styles */
          @media (max-width: 640px) {
            .mobile-text-responsive {
              font-size: clamp(1.5rem, 4vw, 2.5rem);
              line-height: 1.2;
            }
            
            .mobile-padding {
              padding: 1rem;
            }
            
            .mobile-margin {
              margin: 0.5rem 0;
            }
            
            .mobile-grid {
              grid-template-columns: 1fr;
              gap: 0.75rem;
            }
          }

          @media (max-width: 480px) {
            .ultra-mobile-text {
              font-size: clamp(1.25rem, 3.5vw, 2rem);
            }
            
            .ultra-mobile-padding {
              padding: 0.75rem;
            }
          }
        `}
      </style>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(122, 122, 122, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 90% 80%, rgba(122, 122, 122, 0.2) 0%, transparent 50%)`,
          backgroundSize: '100% 100%',
        }}></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#7a7a7a]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#7a7a7a]/15 rounded-full blur-3xl animate-pulse animate-pulse-delay-1"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#7a7a7a]/15 rounded-full blur-3xl animate-pulse animate-pulse-delay-05"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 mt-[70px] sm:mt-[80px]">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20 animate-scaleIn">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 group animate-float">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#ffffff] mobile-text-responsive ultra-mobile-text text-center leading-tight">
              سياسة <span className="text-[#7a7a7a] block sm:inline">الاستخدام والخصوصية</span>
            </h1>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 group animate-float hidden sm:block">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/15 p-3 sm:p-4 max-w-xs sm:max-w-2xl mx-auto animate-slideInRight mobile-padding ultra-mobile-padding">
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a]" />
              <span className="text-gray-100 font-bold text-sm sm:text-base">آخر تحديث: 25 أغسطس 2025م</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/15 shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-12 mobile-padding ultra-mobile-padding">
            {/* Introduction */}
            <div className="mb-6 sm:mb-8 lg:mb-12 animate-fadeInUp">
              <div className="bg-[#7a7a7a]/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 mobile-padding ultra-mobile-padding">
                <p className="text-base sm:text-lg leading-relaxed text-gray-100">
                  مرحبًا بكم في وكالة AfterAds المتخصص في تقديم منتجات رقمية متميزة. نحن ملتزمون بحماية خصوصيتكم وتوفير تجربة استخدام آمنة ومتوافقة مع الأنظمة المعمول بها في المملكة العربية السعودية، بما يشمل نظام التجارة الإلكترونية ونظام حماية البيانات الشخصية (PDPL).
                </p>
              </div>
            </div>

            {/* Section 1: Definitions */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                أولًا: تعريفات عامة
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: 'الوكالة:', text: 'afterads.com، ويشمل الموقع الإلكتروني وجميع خدماته الرقمية.' },
                  { label: 'المستخدم/العميل:', text: 'أي شخص طبيعي أو اعتباري يستخدم المتجر للتصفح أو شراء المنتجات الرقمية.' },
                  { label: 'البيانات الشخصية:', text: 'المعلومات التي تحدد هوية المستخدم مثل الاسم، رقم الجوال، البريد الإلكتروني.' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                      <span className="font-bold text-white text-sm sm:text-base flex-shrink-0">{item.label}</span>
                      <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Agreement */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثانيًا: الموافقة على الشروط
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'باستخدامك للموقع أو الشراء من خلاله، فإنك تقر بموافقتك الكاملة على هذه السياسة.',
                  'إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام الموقع.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-scaleIn mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <p className="text-gray-100 text-sm sm:text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Data Collection */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثالثًا: جمع البيانات واستخدامها
              </h2>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#18b5d5] mb-3 sm:mb-4">نقوم بجمع البيانات التالية:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mobile-grid">
                  {[
                    'الاسم الكامل',
                    'رقم الجوال والبريد الإلكتروني',
                    'معلومات الدفع (عبر بوابات دفع آمنة)',
                    'عنوان IP ونوع المتصفح والجهاز',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="font-bold text-white text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#18b5d5] mb-3 sm:mb-4">نستخدم هذه البيانات من أجل:</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    'معالجة طلبات المنتجات الرقمية',
                    'التواصل معك بشأن حالة الطلب',
                    'تحسين تجربة المستخدم',
                    'الامتثال للمتطلبات النظامية',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-scaleIn mobile-padding ultra-mobile-padding"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                      <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#7a7a7a]/15 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-fadeInUp mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 font-medium text-sm sm:text-base leading-relaxed">
                  لا نقوم بجمع أي بيانات غير ضرورية أو غير مرتبطة بالخدمة، ولا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية دون إذنك.
                </p>
              </div>
            </div>

            {/* Section 4: Data Sharing */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                رابعًا: مشاركة البيانات
              </h2>
              <p className="text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">يتم مشاركة بياناتك فقط مع الأطراف التالية:</p>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: 'مزودي الدفع الإلكتروني', text: 'مثل HyperPay، Apple Pay، Tamara' },
                  { label: 'الجهات الرسمية', text: 'في حال وجود طلب نظامي ملزم' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                      <span className="font-bold text-white text-sm sm:text-base flex-shrink-0">{item.label}:</span>
                      <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Data Protection */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                خامسًا: حماية البيانات
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'نستخدم بروتوكولات أمان مشفّرة (SSL)',
                  'نلتزم بعدم كشف بيانات المستخدم لأي جهة غير مخولة',
                  'نحدّ من الوصول إلى البيانات داخل النظام وفق ضوابط داخلية صارمة',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                    <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: User Rights */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                سادسًا: حقوق المستخدم
              </h2>
              <p className="text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base">وفق نظام حماية البيانات الشخصية، لك الحق في:</p>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {[
                  'معرفة البيانات التي نحتفظ بها',
                  'طلب تصحيح أو حذف بياناتك',
                  'الاعتراض على استخدام بياناتك في الإعلانات أو العروض',
                  'تقديم شكوى للجهات المختصة (مثل الهيئة السعودية للبيانات - سدايا)',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                    <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#7a7a7a]/15 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-fadeInUp mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 text-sm sm:text-base">
                  لطلب أي مما سبق، يرجى التواصل معنا عبر:{' '}
                  <span className="font-bold text-[#7a7a7a]">support@afterads.com</span>
                </p>
              </div>
            </div>

            {/* Section 7: Terms of Use */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                سابعًا: شروط استخدام الموقع
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'يُشترط أن يكون عمر المستخدم 18 عامًا فأكثر',
                  'يتحمل المستخدم مسؤولية استخدام حسابه والمحافظة على بيانات دخوله',
                  'يُمنع استخدام الموقع لأي غرض غير قانوني أو مخالف للآداب العامة',
                  'يحتفظ المتجر بحق تعليق أو إلغاء الحسابات المخالفة دون إشعار',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 8: Intellectual Property */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثامنًا: الملكية الفكرية
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'جميع المحتويات المعروضة في الموقع مملوكة للوكالة ',
                  'يُمنع استخدام أي من هذه المحتويات بدون إذن كتابي مسبق',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Policy Updates */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                تاسعًا: التعديلات على السياسة
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'يحتفظ المتجر بحقه في تعديل أو تحديث هذه السياسة في أي وقت',
                  'سيتم نشر أي تغييرات في هذه الصفحة، ويُعتبر استمرار استخدام الموقع بعد التعديل موافقة ضمنية',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-100 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 10: Applicable Law */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                عاشرًا: القانون المعمول به
              </h2>
              <div className="bg-[#7a7a7a]/15 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-white/10 animate-fadeInUp mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  تخضع هذه السياسة لأنظمة وقوانين المملكة العربية السعودية، ويكون لأي نزاع علاقة بها اختصاص الجهات القضائية المختصة في المملكة.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-6 sm:mb-8 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                للتواصل معنا
              </h2>
              <div className="bg-[#7a7a7a]/15 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-scaleIn mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">لأي استفسارات بخصوص هذه السياسة، يُرجى التواصل عبر:</p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 hover:scale-[1.02] transition-transform duration-300 p-2 rounded-lg hover:bg-[#7a7a7a]/10">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                      <span className="text-gray-100 text-sm sm:text-base">البريد الإلكتروني:</span>
                    </div>
                    <span className="font-bold text-[#7a7a7a] text-sm sm:text-base break-all">info@afterads.com</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 hover:scale-[1.02] transition-transform duration-300 p-2 rounded-lg hover:bg-[#7a7a7a]/10">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                      <span className="text-gray-100 text-sm sm:text-base">رقم الجوال / واتساب:</span>
                    </div>
                    <span className="font-bold text-[#7a7a7a] text-sm sm:text-base">01069006131</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center animate-fadeInUp">
              <Link
                to="/"
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-[#8a8a8a] hover:to-[#5a5a5a] transition-all duration-300 transform hover:scale-105 font-bold shadow-lg text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;