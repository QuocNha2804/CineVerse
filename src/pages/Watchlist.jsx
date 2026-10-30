import { useWatchlist } from "../context/WatchlistContext";
import MovieCard from "../components/movie/MovieCard";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();
  if (watchlist.length === 0)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold dark:text-white mb-4">
          Danh sách yêu thích trống
        </h1>
        <Link
          to="/explore"
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Khám phá ngay
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          Yêu thích ({watchlist.length})
        </h1>
        <button
          onClick={clearWatchlist}
          className="text-red-500 text-sm hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {watchlist.map((m) => (
          <MovieCard key={m.id} movie={m} showRemove />
        ))}
      </div>
    </div>
  );
};
export default Watchlist;
