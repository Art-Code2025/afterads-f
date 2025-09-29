import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebookF, FaEnvelope, FaPhone } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden" dir="rtl">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-[80px]">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="relative w-16 h-16 group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Phone className="w-8 h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#ffffff]" >
              اتصل بنا
            </h1>
            <div className="relative w-16 h-16 group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7a7a7a]/40 to-[#292929]/40 blur-sm transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a7a7a]/30 to-[#292929]/20 backdrop-blur-md border border-[#7a7a7a]/40 transform rotate-0 transition-all duration-500 group-hover:scale-110"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Phone className="w-8 h-8 text-[#7a7a7a] filter drop-shadow-[0_0_12px_rgba(122,122,122,0.9)]" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/15 p-4 max-w-2xl mx-auto animate-fadeInUp">
            <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto px-4">
              نحن هنا لدعمكم! تواصلوا معنا لأي استفسارات حول خدماتنا أو للحصول على مساعدة.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl p-6 sm:p-8 animate-fadeInUp">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                معلومات التواصل
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">رقم الهاتف</h3>
                    <p className="text-gray-100 text-base">01069006131</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">البريد الإلكتروني</h3>
                    <p className="text-gray-100 text-base break-all">info@afterads.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">الموقع</h3>
                    <p className="text-gray-100 text-base">المملكة العربية السعودية</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">ساعات العمل</h3>
                    <p className="text-gray-100 text-base">السبت - الخميس: 9 صباحاً - 6 مساءً</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Notice */}
            <div className="bg-[#7a7a7a]/15 rounded-2xl p-4 sm:p-6 border border-white/10 animate-fadeInUp">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <MessageSquare className="w-6 h-6 text-[#7a7a7a]" />
                <h3 className="text-xl font-bold text-[#18b5d5]" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
                  ملاحظة هامة
                </h3>
              </div>
              <p className="text-gray-100 font-medium text-center text-base">
                مدة التنفيذ تختلف من خدمة الى اخرى 
              </p>
             
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl p-6 sm:p-8 animate-fadeInUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
              أرسل لنا رسالة
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#18b5d5] focus:border-[#18b5d5] transition-all duration-300 text-gray-100 bg-[#292929]/50"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#18b5d5] focus:border-[#18b5d5] transition-all duration-300 text-gray-100 bg-[#292929]/50"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#18b5d5] focus:border-[#18b5d5] transition-all duration-300 text-gray-100 bg-[#292929]/50"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-100 mb-2">
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#18b5d5] focus:border-[#18b5d5] transition-all duration-300 text-gray-100 bg-[#292929]/50"
                  placeholder="موضوع الرسالة"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-100 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#18b5d5] focus:border-[#18b5d5] transition-all duration-300 text-gray-100 bg-[#292929]/50 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white py-3 px-6 rounded-lg hover:from-[#8a8a8a] hover:to-[#5a5a5a] transition-all duration-300 font-bold text-lg shadow-lg"
              >
                إرسال الرسالة
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Quick Contact */}
        <div className="bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl p-4 sm:p-6 animate-fadeInUp mt-6 sm:mt-8">
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] rounded-lg flex items-center justify-center flex-shrink-0">
              <FaWhatsapp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">للتواصل الأسرع</h3>
              <p className="text-gray-100 text-sm">واتساب - استجابة فورية</p>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <a
              href="https://wa.me/201069006131"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white px-4 py-2 rounded-lg hover:from-[#8a8a8a] hover:to-[#5a5a5a] transition-all duration-300 font-medium text-sm shadow-lg"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>ابدأ المحادثة الآن</span>
            </a>
          </div>
        </div>

        {/* Social Media & Additional Info */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-br from-[#292929]/95 via-[#7a7a7a]/30 to-[#292929]/90 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl p-6 sm:p-8 text-center animate-fadeInUp">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#18b5d5] mb-4 sm:mb-6" style={{ textShadow: '0 0 8px rgba(24, 181, 213, 0.5)' }}>
            تابعونا على وسائل التواصل
          </h3>
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
            <a
              href="https://www.instagram.com/afteradscom"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href="https://wa.me/201069006131"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href="https://x.com/afteradscom"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href="https://www.facebook.com/afteradscom"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href="mailto:info@afterads.com"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
            <a
              href="tel:+201069006131"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18b5d5]/20 to-[#18b5d5]/5 border border-[#18b5d5]/30 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-[#18b5d5] hover:bg-[#18b5d5]/10 transition-all duration-400 transform hover:scale-110 hover:-translate-y-1"
            >
              <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 text-[#18b5d5] group-hover:text-white transition-colors duration-300" />
            </a>
          </div>
          <p className="text-gray-100 text-base sm:text-lg">
            <span className="font-bold text-[#18b5d5]">AfterAds</span> - وكالة سعودية للمنتجات الرقمية
          </p>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">نشارككم الابتكار والتميز</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;