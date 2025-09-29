import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Phone, Calendar, User, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
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
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-slideInRight {
            animation: slideInRight 0.6s ease-out forwards;
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

          h2:hover, h3:hover {
            filter: brightness(1.2);
            transition: filter 0.3s ease;
          }

          /* Mobile Responsive Classes */
          @media (max-width: 640px) {
            .mobile-text-responsive {
              font-size: 1.25rem !important;
              line-height: 1.75rem !important;
            }
            .mobile-padding {
              padding: 1rem !important;
            }
            .mobile-margin {
              margin: 0.75rem 0 !important;
            }
            .mobile-grid {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
            }
          }

          @media (max-width: 480px) {
            .ultra-mobile-text {
              font-size: 1.125rem !important;
              line-height: 1.625rem !important;
            }
            .ultra-mobile-padding {
              padding: 0.75rem !important;
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

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 mt-[80px] mobile-padding ultra-mobile-padding">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-scaleIn">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 group animate-float">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#ffffff] text-center">
              <span className="block sm:inline">الشروط والأحكام</span>
            </h1>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 group hidden sm:block">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/15 p-3 sm:p-4 max-w-xs sm:max-w-2xl mx-auto animate-slideInRight">
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
              <span className="text-gray-100 font-bold text-sm sm:text-base">آخر تحديث: 25 أغسطس 2025م</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/15 shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-12 mobile-padding ultra-mobile-padding">
            {/* Introduction */}
            <div className="mb-6 sm:mb-8 lg:mb-12 animate-fadeInUp">
              <div className="bg-[#7a7a7a]/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10">
                <p className="text-base sm:text-lg leading-relaxed text-gray-100">
                  مرحبًا بكم في وكالة AfterAds، المتخصصة في تقديم منتجات وخدمات رقمية متميزة. تحدد هذه الشروط والأحكام قواعد استخدام موقعنا الإلكتروني afterads.com وجميع الخدمات المرتبطة به. باستخدامكم للموقع، فإنكم توافقون على الالتزام بهذه الشروط، وفقًا لأنظمة المملكة العربية السعودية بما في ذلك نظام التجارة الإلكترونية.
                </p>
              </div>
            </div>

            {/* Section 1: Definitions */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                أولًا: تعريفات عامة
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: 'الوكالة:', text: 'afterads.com، ويشمل الموقع الإلكتروني وجميع خدماته الرقمية.' },
                  { label: 'المستخدم/العميل:', text: 'أي شخص طبيعي أو اعتباري يستخدم الوكالة للتصفح أو شراء المنتجات أو الخدمات الرقمية.' },
                  { label: 'الخدمات:', text: 'المنتجات الرقمية والخدمات المقدمة عبر الموقع مثل الإعلانات الرقمية أو الاشتراكات.' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="font-bold text-white text-sm sm:text-base flex-shrink-0">{item.label}</span>
                      <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Agreement */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثانيًا: الموافقة على الشروط
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'باستخدامك للموقع أو الشراء من خلاله، فإنك تقر بموافقتك الكاملة على هذه الشروط والأحكام.',
                  'إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام الموقع أو خدماته.',
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

            {/* Section 3: User Responsibilities */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثالثًا: مسؤوليات المستخدم
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'يجب أن يكون عمر المستخدم 18 عامًا أو أكثر.',
                  'يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات حسابه.',
                  'يُمنع استخدام الموقع لأغراض غير قانونية أو مخالفة للآداب العامة.',
                  'يجب على المستخدم تقديم معلومات دقيقة ومحدثة عند التسجيل أو الشراء.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                    <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Payment Terms */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                رابعًا: شروط الدفع
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'يتم معالجة المدفوعات عبر بوابات دفع آمنة مثل HyperPay، Apple Pay، وTamara.',
                  'جميع الأسعار المعروضة تشمل الضرائب المعمول بها وفق قوانين المملكة العربية السعودية.',
                  'الوكالة غير مسؤولة عن أي رسوم إضافية تفرضها البنوك أو مزودي الدفع.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-scaleIn mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#7a7a7a]" />
                    <span className="text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Cancellation and Refunds */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                خامسًا: الإلغاء والاسترداد
              </h2>
              <div className="space-y-3">
                {[
                  'المنتجات الرقمية غير قابلة للإرجاع أو الاسترداد بعد التسليم الإلكتروني، وفقًا لطبيعتها.',
                  'يمكن طلب إلغاء الطلب قبل تسليم المنتج الرقمي، مع التواصل عبر support@afterads.com.',
                  'في حال وجود مشكلة فنية في المنتج، يمكن طلب الدعم الفني أو استرداد المبلغ خلال 7 أيام.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                    <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Intellectual Property */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                سادسًا: الملكية الفكرية
              </h2>
              <div className="space-y-3">
                {[
                  'جميع المحتويات المعروضة في الموقع (صور، نصوص، تصاميم، شعارات، منتجات رقمية) مملوكة لوكالة AfterAds.',
                  'يُمنع استخدام أي من هذه المحتويات أو إعادة توزيعها بدون إذن كتابي مسبق من الوكالة.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp mobile-padding ultra-mobile-padding"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                سابعًا: حدود المسؤولية
              </h2>
              <div className="space-y-3">
                {[
                  'الوكالة ليست مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو الخدمات.',
                  'نحتفظ بالحق في تعليق أو إنهاء الخدمات في أي وقت دون إشعار مسبق.',
                  'المستخدم مسؤول عن التأكد من ملاءمة الخدمات لاحتياجاته قبل الشراء.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-[#7a7a7a]/15 p-4 rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#7a7a7a]" />
                    <span className="text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 8: Modifications to Terms */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                ثامنًا: التعديلات على الشروط
              </h2>
              <div className="space-y-3">
                {[
                  'تحتفظ الوكالة بالحق في تعديل هذه الشروط والأحكام في أي وقت.',
                  'سيتم نشر أي تغييرات على هذه الصفحة، ويُعتبر استمرار استخدام الموقع موافقة ضمنية على التعديلات.',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#7a7a7a]/15 p-4 rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Applicable Law */}
            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                تاسعًا: القانون المعمول به
              </h2>
              <div className="bg-[#7a7a7a]/15 p-4 sm:p-6 rounded-xl border border-white/10 animate-fadeInUp mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                  تخضع هذه الشروط والأحكام لأنظمة وقوانين المملكة العربية السعودية، ويكون لأي نزاع علاقة بها اختصاص الجهات القضائية المختصة في المملكة.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-6 sm:mb-8 animate-fadeInUp">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                للتواصل معنا
              </h2>
              <div className="bg-[#7a7a7a]/15 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-scaleIn mobile-padding ultra-mobile-padding">
                <p className="text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">لأي استفسارات بخصوص هذه الشروط والأحكام، يُرجى التواصل عبر:</p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 hover:scale-[1.02] transition-transform duration-300 p-2 rounded-lg hover:bg-[#7a7a7a]/10">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                      <span className="text-gray-100 text-sm sm:text-base">البريد الإلكتروني:</span>
                    </div>
                    <span className="font-bold text-[#7a7a7a] text-sm sm:text-base break-all">support@afterads.com</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 hover:scale-[1.02] transition-transform duration-300 p-2 rounded-lg hover:bg-[#7a7a7a]/10">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
                      <span className="text-gray-100 text-sm sm:text-base">رقم الجوال / واتساب:</span>
                    </div>
                    <span className="font-bold text-[#7a7a7a] text-sm sm:text-base">+966551064118</span>
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

export default TermsAndConditions;