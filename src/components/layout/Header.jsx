import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useWatchlist } from "../../context/WatchlistContext";
import {
  IconFilm,
  IconSearch,
  IconSun,
  IconMoon,
  IconHeart,
  IconMenu,
  IconClose,
  IconUser,
  IconClock,
} from "../common/Icons";

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsOpen(false);
  }

  // Hiệu ứng thanh Header khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ("");
      setIsOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/explore", label: "Khám phá" },
    {
      to: "/watchlist",
      label: "Yêu thích",
      badge: watchlist.length > 0 ? watchlist.length : null,
      icon: IconHeart,
    },
    { to: "/history", label: "Lịch sử", icon: IconClock },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md shadow-lg shadow-black/10 dark:shadow-black/40 border-b border-gray-200/80 dark:border-gray-800/80 py-2.5"
          : "bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-3 md:gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group flex-shrink-0"
          aria-label="CineVerse Trang chủ"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-red-500 flex items-center justify-center text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
            <IconFilm className="w-5 h-5" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-red-500 to-rose-400 bg-clip-text text-transparent">
            CineVerse
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-primary bg-primary/10 dark:bg-primary/15"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  }`
                }
              >
                {Icon && <Icon className="w-4 h-4 opacity-80" />}
                <span>{link.label}</span>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-xs font-bold bg-primary text-white rounded-full leading-none">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Search Bar (Desktop/Tablet) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xs lg:max-w-md relative items-center"
        >
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm phim, diễn viên..."
            className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 border border-transparent dark:border-gray-700/60 focus:border-primary focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="absolute left-3 text-gray-400 hover:text-primary transition-colors"
          >
            <IconSearch className="w-4 h-4" />
          </button>
        </form>

        {/* Right Action Icons (Theme, Auth, Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện sáng/tối"
            className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            title={theme === "dark" ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
          >
            {theme === "dark" ? (
              <IconSun className="w-5 h-5 text-amber-400" />
            ) : (
              <IconMoon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* Quick Search on Mobile Header */}
          <Link
            to="/search"
            aria-label="Tìm kiếm phim"
            className="md:hidden p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconSearch className="w-5 h-5" />
          </Link>

          {/* User Account / Login Button */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-700/60 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[80px] md:max-w-[120px] truncate hidden sm:inline">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
            >
              <IconUser className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Mở danh mục điều hướng"
            className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-4 py-4 space-y-4 animate-slide-up shadow-2xl">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm phim, diễn viên..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="absolute left-3 top-3 text-gray-400 hover:text-primary"
            >
              <IconSearch className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 opacity-90" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-white text-primary rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
            {user ? (
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <IconUser className="w-5 h-5" />
                <span>Hồ sơ cá nhân ({user.name})</span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-primary hover:bg-primary/10 transition-colors"
              >
                <IconUser className="w-5 h-5" />
                <span>Đăng nhập / Đăng ký</span>
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
