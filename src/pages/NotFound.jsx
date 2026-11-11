import { Link } from "react-router-dom";
import { IconFilm, IconPlay } from "../components/common/Icons";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center animate-fade-in">
      <div className="relative mb-6">
        <span className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-primary via-red-500 to-amber-500 bg-clip-text text-transparent select-none opacity-90 drop-shadow-2xl">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 border-2 border-primary flex items-center justify-center text-primary shadow-xl">
            <IconFilm className="w-8 h-8 animate-pulse" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
        Trang Không Tồn Tại
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        Có vẻ như thước phim bạn đang tìm kiếm đã bị thất lạc trong vũ trụ điện ảnh hoặc đường dẫn không còn khả dụng.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95 transition-all"
        >
          <IconPlay className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
        <Link
          to="/explore"
          className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700 transition-all"
        >
          Khám phá phim khác
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
