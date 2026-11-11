import { useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { getImageUrl } from "../services/tmdbApi";
import ImageWithFallback from "../components/common/ImageWithFallback";
import Modal from "../components/common/Modal";
import { IconClock, IconTrash, IconPlay } from "../components/common/Icons";

const History = () => {
  const { history, clearHistory, removeFromHistory } = useWatchlist();
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const handleConfirmClear = () => {
    clearHistory();
    setIsConfirmClearOpen(false);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-6">
          <IconClock className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
          Lịch Sử Xem Trống
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          Bạn chưa xem chi tiết bộ phim nào. Khi bạn khám phá và xem các tác phẩm trên CineVerse, lịch sử sẽ tự động được ghi nhận tại đây!
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          Khám phá phim ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Lịch Sử Xem Phim
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm">
              {history.length} mục
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Các tác phẩm bạn đã truy cập và theo dõi gần đây
          </p>
        </div>

        <button
          onClick={() => setIsConfirmClearOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/30 transition-all flex items-center gap-1.5"
        >
          <IconTrash className="w-4 h-4" />
          <span>Xóa lịch sử</span>
        </button>
      </div>

      {/* Danh Sách Timeline */}
      <div className="space-y-3">
        {history.map((m) => {
          const posterUrl = getImageUrl(m.poster_path, "w185");
          const dateStr = m.watchedAt
            ? new Date(m.watchedAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Gần đây";

          return (
            <div
              key={`${m.id}-${m.watchedAt}`}
              className="flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Poster nhỏ */}
              <Link
                to={`/movie/${m.id}`}
                className="w-14 sm:w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
              >
                <ImageWithFallback
                  src={posterUrl}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </Link>

              {/* Thông tin phim */}
              <div className="flex-1 min-w-0">
                <Link to={`/movie/${m.id}`}>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                    {m.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                  <IconClock className="w-3.5 h-3.5" />
                  <span>Đã xem: {dateStr}</span>
                </div>
              </div>

              {/* Hành động */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/movie/${m.id}`}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <IconPlay className="w-3 h-3" />
                  <span className="hidden sm:inline">Xem lại</span>
                </Link>

                <button
                  onClick={() => removeFromHistory(m.id)}
                  aria-label="Xóa khỏi lịch sử"
                  title="Xóa mục này"
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal xác nhận xóa */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        size="sm"
        title="Xóa toàn bộ lịch sử"
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto">
            <IconTrash className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Bạn có chắc chắn muốn xóa tất cả <strong>{history.length}</strong> bộ phim trong lịch sử xem không?
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

export default History;
