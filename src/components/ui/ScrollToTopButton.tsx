import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <button
        onClick={scrollToTop}
        aria-label="التمرير للأعلى"
        className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-300"
      >
        {/* السهم الطويل المتجه لأعلى */}
        <div className="flex flex-col items-center" style={{ color: "#18b5d5" }}>
          <div className="text-lg font-bold">▲</div>
          <div className="w-0.5 h-6 bg-current"></div>
        </div>

        {/* النص العمودي */}
        <span className="text-white text-sm tracking-widest [writing-mode:vertical-rl]">
          التمرير للأعلى
        </span>
      </button>
    </div>
  );
};

export default ScrollToTopButton;