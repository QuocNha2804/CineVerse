import { Link } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import { getImageUrl } from "../../services/tmdbApi";
import ImageWithFallback from "../common/ImageWithFallback";
import { IconStar, IconHeart, IconTrash } from "../common/Icons";

const MovieCard = ({ movie, showRemove = false }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : movie.first_air_date
      ? movie.first_air_date.split("-")[0]
      : "N/A";
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : null;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchlist(movie.id);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full">
      {/* Khung Poster */}
      <Link to={`/movie/${movie.id}`} className="relative block aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
        <ImageWithFallback
          src={posterUrl}
          alt={movie.title || "Poster phim"}
          fallbackText={movie.title || "Phim"}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient mờ nhẹ khi hover trên desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />

        {/* Badge Rating */}
        {rating && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-md">
            <IconStar className="w-3.5 h-3.5" />
            <span className="text-white">{rating}</span>
          </div>
        )}

        {/* Badge Chất Lượng HD */}
        <div className="absolute bottom-2.5 left-2.5 z-10 px-1.5 py-0.5 rounded bg-primary/90 text-[10px] font-extrabold text-white tracking-wider uppercase opacity-90 shadow-sm">
          HD
        </div>
      </Link>

      {/* Nút Thả Tim (Yêu Thích) */}
      <button
        onClick={handleFavoriteClick}
        title={inList ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        aria-label={inList ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md active:scale-90 ${
          inList
            ? "bg-primary text-white scale-105"
            : "bg-black/60 text-white/90 hover:bg-black/80 hover:text-white"
        }`}
      >
        <IconHeart className="w-4 h-4" filled={inList} />
      </button>

      {/* Nút Xóa nhanh (nếu ở trang Watchlist) */}
      {showRemove && (
        <button
          onClick={handleRemoveClick}
          title="Xóa phim này"
          aria-label="Xóa phim này"
          className="absolute bottom-16 right-2.5 z-20 p-2 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-lg transition-all active:scale-90"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      )}

      {/* Khối Thông Tin Chi Tiết Bên Dưới */}
      <div className="p-3 flex flex-col flex-grow justify-between bg-white dark:bg-gray-900">
        <Link to={`/movie/${movie.id}`}>
          <h3
            className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary transition-colors"
            title={movie.title}
          >
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
          <span>{releaseYear}</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300">
            Phim lẻ
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
