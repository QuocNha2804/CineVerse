import { useWatchlist } from "../context/WatchlistContext";
import MovieCard from "../components/movie/MovieCard";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        {/* Icon trái tim mờ */}
        <svg
          className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Danh sách yêu thích trống
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Bạn chưa lưu bộ phim nào. Hãy khám phá và thêm những bộ phim yêu thích
          của mình vào đây nhé!
        </p>
        <Link
          to="/explore"
          className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-primary/30"
        >
          Khám phá phim ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Yêu thích{" "}
          <span className="text-primary ml-1">({watchlist.length})</span>
        </h1>
        <button
          onClick={clearWatchlist}
          className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {watchlist.map((m) => (
          <MovieCard key={m.id} movie={m} showRemove />
        ))}
      </div>
    </div>
  );
};
export default Watchlist;
