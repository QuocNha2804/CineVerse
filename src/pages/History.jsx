import { useWatchlist } from "../context/WatchlistContext";
import { getImageUrl } from "../services/tmdbApi";
import { Link } from "react-router-dom";

const History = () => {
  const { history, clearHistory } = useWatchlist();
  if (history.length === 0)
    return (
      <div className="text-center py-20 dark:text-gray-400">
        Lịch sử xem trống.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Lịch sử xem</h1>
        <button
          onClick={clearHistory}
          className="text-red-500 text-sm hover:underline"
        >
          Xóa lịch sử
        </button>
      </div>
      <div className="space-y-4">
        {history.map((m) => (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <img
              src={getImageUrl(m.poster_path, "w92")}
              className="w-16 rounded"
              alt=""
            />
            <div>
              <h3 className="font-bold dark:text-white">{m.title}</h3>
              <p className="text-sm text-gray-500">
                Đã xem lúc: {new Date(m.watchedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default History;
