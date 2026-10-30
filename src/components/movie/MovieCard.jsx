import { Link } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import { getImageUrl } from "../../services/tmdbApi";

const MovieCard = ({ movie, showRemove = false }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 animate-fade-in">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white text-xs">
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-300 text-xs ml-auto">
              {movie.release_date?.split("-")[0]}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-primary transition-colors z-10"
      >
        {inList ? "❤️" : "🤍"}
      </button>
      {showRemove && (
        <button
          onClick={() => removeFromWatchlist(movie.id)}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-red-500 text-white text-xs z-10"
        >
          ✕
        </button>
      )}
    </div>
  );
};
export default MovieCard;
