import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetail, getImageUrl } from "../services/tmdbApi";
import { useWatchlist } from "../context/WatchlistContext";
import Modal from "../components/common/Modal";

const MovieDetail = () => {
  const { id } = useParams();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } =
    useWatchlist();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
    getMovieDetail(id)
      .then((d) => {
        setMovie(d);
        addToHistory(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, addToHistory]);

  if (loading)
    return (
      <div className="text-center py-20 dark:text-white">
        Đang tải chi tiết...
      </div>
    );
  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <div>
      <div className="relative h-[50vh] md:h-[70vh]">
        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          className="w-full h-full object-cover"
          alt={movie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </div>
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            className="w-48 md:w-64 rounded-xl shadow-2xl mx-auto md:mx-0"
            alt=""
          />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
              {movie.title}
            </h1>
            <p className="text-gray-500 italic mt-1">{movie.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm dark:text-gray-300">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>{movie.runtime} phút</span>
            </div>
            <div className="flex gap-3 mt-6">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium"
                >
                  ▶ Xem Trailer
                </button>
              )}
              <button
                onClick={() =>
                  inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
                }
                className={`px-6 py-2.5 rounded-lg font-medium border ${inList ? "border-primary text-primary" : "border-gray-300 dark:border-gray-600 dark:text-white"}`}
              >
                {inList ? "❤️ Yêu thích" : "🤍 Thêm vào yêu thích"}
              </button>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {movie.overview}
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-10 border-b dark:border-gray-700">
          {["overview", "cast", "similar"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium border-b-2 ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500"}`}
            >
              {t === "overview"
                ? "Tổng quan"
                : t === "cast"
                  ? "Diễn viên"
                  : "Phim tương tự"}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === "overview" && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm dark:text-gray-300">
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt>Đạo diễn:</dt>
                <dd>{director?.name || "N/A"}</dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt>Quốc gia:</dt>
                <dd>
                  {movie.production_countries?.map((c) => c.name).join(", ")}
                </dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt>Ngân sách:</dt>
                <dd>
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt>Doanh thu:</dt>
                <dd>
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </dd>
              </div>
            </dl>
          )}
          {tab === "cast" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {movie.credits?.cast?.slice(0, 12).map((p) => (
                <div key={p.id} className="text-center">
                  <img
                    src={getImageUrl(p.profile_path, "w185")}
                    className="w-full aspect-square object-cover rounded-full mb-2"
                    alt=""
                  />
                  <p className="text-sm font-medium dark:text-white line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {p.character}
                  </p>
                </div>
              ))}
            </div>
          )}
          {tab === "similar" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {movie.similar?.results?.slice(0, 10).map((m) => (
                <div
                  key={m.id}
                  onClick={() => (window.location.href = `/movie/${m.id}`)}
                  className="cursor-pointer"
                >
                  <img
                    src={getImageUrl(m.poster_path, "w342")}
                    className="w-full rounded-lg"
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        size="xl"
      >
        {trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
          />
        ) : (
          <p className="p-10 text-center">Không có trailer</p>
        )}
      </Modal>
    </div>
  );
};
export default MovieDetail;
