import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setQ("");
      setIsOpen(false);
    }
  };
  const links = [
    { to: "/", label: "Trang chủ" },
    { to: "/explore", label: "Khám phá" },
    { to: "/watchlist", label: "Yêu thích" },
    { to: "/history", label: "Lịch sử" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          CineVerse
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-400 hover:text-primary"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <form
          onSubmit={handleSearch}
          className="hidden md:block flex-1 max-w-md"
        >
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm phim..."
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-sm dark:text-white max-w-[100px] truncate">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg"
            >
              Đăng nhập
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl dark:text-white"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800 space-y-3">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white text-sm"
            />
          </form>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm dark:text-gray-300"
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-primary"
            >
              Hồ sơ
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-primary"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
export default Header;
