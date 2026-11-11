import { Link } from "react-router-dom";
import { IconFilm, IconHeart, IconSparkles } from "../common/Icons";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800/80 bg-white dark:bg-[#080c14] text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30">
                <IconFilm className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                CineVerse
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Trải nghiệm điện ảnh đỉnh cao trong tầm tay bạn. Khám phá hàng ngàn bộ phim bom tấn, cập nhật thông tin diễn viên, trailer và đánh giá uy tín từ cộng đồng toàn cầu.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-medium">
              <IconSparkles className="w-4 h-4" />
              <span>Dữ liệu phong phú chuẩn TMDB API</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Khám phá
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Khám phá toàn bộ phim
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">
                  Tìm kiếm thông minh
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-primary transition-colors">
                  Danh sách yêu thích
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-primary transition-colors">
                  Lịch sử xem gần đây
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Danh mục nổi bật */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Thể loại phim
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Phim Hành Động (Action)
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Khoa Học Viễn Tưởng (Sci-Fi)
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Phim Hoạt Hình (Animation)
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Phim Kinh Dị (Horror)
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Hài Hước & Gia Đình
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tài khoản & Trợ giúp */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Tài khoản
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  Đăng ký tài khoản
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
              Sản phẩm phục vụ mục đích phi thương mại và học tập.
            </div>
          </div>
        </div>

        {/* Thanh bản quyền đáy */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} CineVerse. Tất cả quyền được bảo lưu. Dữ liệu và hình ảnh được cung cấp bởi{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              TMDB
            </a>
            .
          </p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Thiết kế với</span>
            <IconHeart className="w-3.5 h-3.5 text-primary" filled />
            <span>cho người yêu điện ảnh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
