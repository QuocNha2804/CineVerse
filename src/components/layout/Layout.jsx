import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { IconArrowUp } from "../common/Icons";

const Layout = () => {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Tự động cuộn lên đầu trang khi chuyển route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Hiển thị nút Back-to-Top khi cuộn xuống hơn 400px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* Nút cuộn lên đầu trang nổi */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-white shadow-xl hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all duration-200 animate-fade-in"
        >
          <IconArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Layout;
