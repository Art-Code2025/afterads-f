import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Client {
  id: number;
  logo?: string;
  website?: string;
}

interface ClientsSectionProps {
  clients: Client[];
}

const ClientsSection: React.FC<ClientsSectionProps> = ({ clients }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 0,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 6 } },
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  if (!clients || clients.length === 0) return null;

  return (
    <section
      data-section="clients"
      className="py-20 bg-gradient-to-br from-[#1a1a1a] via-[#292929] to-[#1a1a1a] relative overflow-hidden w-full"
    >
      {/* الخلفية الإبداعية */}
      <div className="absolute inset-0">
        {/* شبكة هندسية */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(24, 181, 216, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(24, 181, 216, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* نقاط ضوئية بسيطة */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#18b5d8]/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
        
        {/* تدرجات لونية */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#18b5d8]/5 via-transparent to-[#18b5d8]/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#292929]/50 via-transparent to-[#292929]/50"></div>
        
        {/* خط متموج بسيط */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-t from-[#18b5d8]/20 to-transparent"></div>
        </div>
      </div>

      <div className="relative z-10 w-full">
        {/* العنوان */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-[#18b5d8]/10 border border-[#18b5d8]/20 text-[#18b5d8] px-6 py-3 rounded-full mb-8 backdrop-blur-sm">
            <span className="font-semibold">عملائنا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            نفخر{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18b5d8] to-[#0d8aa3] animate-pulse">
              بشركائنا
            </span>
          </h2>
        </div>

        {/* الكاروسيل */}
        <Slider {...settings}>
          {clients.map((client) =>
            client.logo ? (
              <div key={client.id} className="px-2 sm:px-3">
                <a
                  href={
                    client.website?.startsWith("http")
                      ? client.website
                      : `https://${client.website}` 
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex items-center justify-center"
                >
                  <img
                    src={client.logo}
                    alt="client logo"
                    className="h-16 sm:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </a>
              </div>
            ) : null
          )}
        </Slider>
      </div>
    </section>
  );
};

export default ClientsSection;