import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import MovieCard from "../components/movie/MovieCard";
import Modal from "../components/common/Modal";
import { IconHeart, IconTrash, IconSearch, IconSparkles } from "../components/common/Icons";

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Lọc và sắp xếp danh sách yêu thích
  const filteredMovies = useMemo(() => {
    let result = [...watchlist];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((m) =>
        m.title?.toLowerCase().includes(term),
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // newest (addedAt)
      result.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    }

    return result;
  }, [watchlist, searchTerm, sortBy]);

  const handleConfirmClear = () => {
    clearWatchlist();
    setIsConfirmClearOpen(false);
  };

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
          <IconHeart className="w-10 h-10" filled />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
          Danh Sách Yêu Thích Trống
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          Bạn chưa lưu bộ phim nào. Hãy bấm vào biểu tượng trái tim ở bất kỳ bộ phim nào để xem lại bất cứ khi nào bạn muốn!
        </p>
        <Link
          to="/explore"
          className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          Khám phá phim ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Phim Yêu Thích
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-sm">
              {watchlist.length} bộ phim
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bộ sưu tập những tác phẩm điện ảnh đặc sắc bạn đã lưu lại
          </p>
        </div>

        <button
          onClick={() => setIsConfirmClearOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/30 transition-all flex items-center gap-1.5"
        >
          <IconTrash className="w-4 h-4" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Toolbar Lọc và Sắp Xếp */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Lọc theo tên phim đã lưu..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
          />
          <IconSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none p-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          >
            <option value="newest">Mới thêm gần đây</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="title">Tên phim A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid Movies */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {filteredMovies.map((m) => (
            <MovieCard key={m.id} movie={m} showRemove />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <IconSparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Không tìm thấy phim khớp với từ khóa "{searchTerm}" trong danh sách yêu thích.
          </p>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Toàn Bộ */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        size="sm"
        title="Xác nhận xóa danh sách"
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto">
            <IconTrash className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Bạn có chắc chắn muốn xóa toàn bộ <strong>{watchlist.length}</strong> bộ phim khỏi danh sách yêu thích không? Thao tác này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsConfirmClearOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirmClear}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-600/30"
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Watchlist;
