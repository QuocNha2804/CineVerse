import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
    setTab("overview");
    setLoading(true);
    setMovie(null); // Reset phim cũ trước khi tải phim mới

    getMovieDetail(id)
      .then((d) => {
        setMovie(d);
        addToHistory(d); // Lưu vào lịch sử
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // BỎ addToHistory KHỎI MẢNG NÀY ĐỂ TRÁNH LẶP VÔ HẠN
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 dark:text-white min-h-[50vh]">
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
    <div className="min-h-screen pb-10">
      <div className="relative h-[50vh] md:h-[70vh]">
        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          className="w-full h-full object-cover"
          alt={movie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-48 md:w-64 mx-auto md:mx-0 flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              className="w-full rounded-xl shadow-2xl"
              alt={movie.title}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
              {movie.title}
            </h1>
            <p className="text-gray-500 italic mt-1">{movie.tagline}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm dark:text-gray-300">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>{movie.runtime} phút</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  ▶ Xem Trailer
                </button>
              )}
              <button
                onClick={() =>
                  inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
                }
                className={`px-6 py-2.5 rounded-lg font-medium border transition ${
                  inList
                    ? "border-primary text-primary bg-primary/10"
                    : "border-gray-300 dark:border-gray-600 dark:text-white hover:border-primary"
                }`}
              >
                {inList ? "❤️ Yêu thích" : "🤍 Thêm vào yêu thích"}
              </button>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 md:line-clamp-none">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-10 border-b dark:border-gray-700 overflow-x-auto">
          {["overview", "cast", "similar"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              {t === "overview"
                ? "Tổng quan"
                : t === "cast"
                  ? "Diễn viên"
                  : "Phim tương tự"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {tab === "overview" && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm dark:text-gray-300">
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt className="text-gray-500">Đạo diễn:</dt>
                <dd className="font-medium dark:text-white">
                  {director?.name || "Đang cập nhật"}
                </dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt className="text-gray-500">Quốc gia:</dt>
                <dd className="font-medium dark:text-white">
                  {movie.production_countries?.map((c) => c.name).join(", ") ||
                    "Đang cập nhật"}
                </dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt className="text-gray-500">Ngân sách:</dt>
                <dd className="font-medium dark:text-white">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </dd>
              </div>
              <div className="flex justify-between border-b dark:border-gray-800 pb-2">
                <dt className="text-gray-500">Doanh thu:</dt>
                <dd className="font-medium dark:text-white">
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
                    className="w-full aspect-square object-cover rounded-full mb-2 shadow-md bg-gray-200 dark:bg-gray-800"
                    alt={p.name}
                  />
                  <p className="text-sm font-medium dark:text-white line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {p.character}
                  </p>
                </div>
              ))}
              {movie.credits?.cast?.length === 0 && (
                <p className="col-span-full text-gray-500">
                  Không có thông tin diễn viên.
                </p>
              )}
            </div>
          )}

          {tab === "similar" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {movie.similar?.results?.slice(0, 10).map((m) => (
                /* ĐÃ SỬA: Dùng Link thay vì window.location.href */
                <Link
                  to={`/movie/${m.id}`}
                  key={m.id}
                  className="cursor-pointer group"
                >
                  <img
                    src={getImageUrl(m.poster_path, "w342")}
                    className="w-full rounded-lg group-hover:opacity-75 transition-opacity"
                    alt={m.title}
                  />
                  <p className="text-sm font-medium mt-2 dark:text-white line-clamp-1 text-center">
                    {m.title}
                  </p>
                </Link>
              ))}
              {movie.similar?.results?.length === 0 && (
                <p className="col-span-full text-gray-500">
                  Không có phim tương tự.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Trailer */}
      <Modal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        size="xl"
      >
        {trailer ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            />
          </div>
        ) : (
          <p className="p-10 text-center text-gray-500">
            Không có trailer cho phim này.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default MovieDetail;
