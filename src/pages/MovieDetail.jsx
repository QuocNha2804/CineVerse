import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetail, getImageUrl } from "../services/tmdbApi";
import { useWatchlist } from "../context/WatchlistContext";
import ImageWithFallback from "../components/common/ImageWithFallback";
import TrailerModal from "../components/movie/TrailerModal";
import CastCard from "../components/movie/CastCard";
import MovieCard from "../components/movie/MovieCard";
import { formatCurrency } from "../utils/formatCurrency";
import {
  IconPlay,
  IconStar,
  IconHeart,
  IconShare,
  IconClock,
  IconFilm,
  IconSparkles,
} from "../components/common/Icons";
import toast from "react-hot-toast";

const MovieDetail = () => {
  const { id } = useParams();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } =
    useWatchlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isPlayingMovie, setIsPlayingMovie] = useState(false);
  const [tab, setTab] = useState("overview");

  // State cho review người dùng
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem(`cv_reviews_${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(10);
  const [reviewerName, setReviewerName] = useState("");

  useEffect(() => {
    let isCurrent = true;

    // Tải chi tiết phim từ TMDB
    getMovieDetail(id)
      .then((data) => {
        if (!isCurrent) return;
        setMovie(data);
        setLoading(false);
        setError(null);
        addToHistory(data);

        try {
          const stored = localStorage.getItem(`cv_reviews_${id}`);
          setReviews(stored ? JSON.parse(stored) : []);
        } catch {
          setReviews([]);
        }
      })
      .catch((err) => {
        if (!isCurrent) return;
        console.error(err);
        setError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
        setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const reviewObj = {
      id: Date.now(),
      author: reviewerName.trim() || "Khán giả ẩn danh",
      content: newReviewText.trim(),
      rating: newReviewRating,
      createdAt: new Date().toISOString(),
    };

    const updated = [reviewObj, ...reviews];
    setReviews(updated);
    localStorage.setItem(`cv_reviews_${id}`, JSON.stringify(updated));
    setNewReviewText("");
    toast.success("Cảm ơn bạn đã gửi đánh giá!");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết phim vào bộ nhớ tạm!", {
        icon: "🔗",
      });
    } else {
      toast.success("Chia sẻ phim thành công!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 animate-pulse">
        <div className="w-full h-80 rounded-3xl bg-gray-200 dark:bg-gray-800 mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 mx-auto md:mx-0 flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-3">
          {error || "Không tìm thấy bộ phim này"}
        </h2>
        <p className="text-gray-500 mb-6">
          Bộ phim có thể đã bị gỡ hoặc đường dẫn không chính xác.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/30"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id);
  const director = movie.credits?.crew?.find(
    (c) => c.job === "Director" || c.department === "Directing",
  );
  const writers = movie.credits?.crew
    ?.filter((c) => c.job === "Screenplay" || c.job === "Writer")
    ?.slice(0, 3);
  const trailerVideos = movie.videos?.results || [];
  const primaryTrailer =
    trailerVideos.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.name?.toLowerCase().includes("trailer")),
    ) || trailerVideos.find((v) => v.site === "YouTube");

  const similarMovies = movie.similar?.results?.slice(0, 12) || [];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const durationHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const durationMinutes = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div className="min-h-screen pb-16 animate-fade-in">
      {/* Backdrop Hero Section */}
      <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] max-h-[650px] overflow-hidden bg-black">
        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-60 dark:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0b0f17] via-[#0b0f17]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-[#0b0f17] via-transparent to-transparent hidden md:block" />
      </section>

      {/* Main Details Container */}
      <div className="container mx-auto px-4 -mt-24 sm:-mt-36 md:-mt-48 relative z-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Poster Column */}
          <div className="w-48 sm:w-60 md:w-72 mx-auto md:mx-0 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 dark:border-gray-800 bg-gray-900 group">
              <ImageWithFallback
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {/* Quick Actions dưới poster trên desktop */}
            <div className="hidden md:flex flex-col gap-2.5 mt-4">
              <button
                onClick={() => setIsPlayingMovie(true)}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <IconPlay className="w-5 h-5" />
                <span>Xem Phim Ngay</span>
              </button>

              {primaryTrailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <IconFilm className="w-4 h-4 text-primary" />
                  <span>Xem Trailer</span>
                </button>
              )}
            </div>
          </div>

          {/* Information Column */}
          <div className="flex-1 text-center md:text-left">
            {/* Title & Tagline */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              {movie.title}
            </h1>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium mt-1">
                Tên gốc: {movie.original_title}
              </p>
            )}
            {movie.tagline && (
              <p className="text-xs sm:text-sm italic text-primary dark:text-red-400 mt-2 font-medium">
                "{movie.tagline}"
              </p>
            )}

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 mt-4 text-xs font-semibold">
              {rating && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1.5 shadow-sm">
                  <IconStar className="w-3.5 h-3.5" />
                  <span>{rating} / 10 ({movie.vote_count?.toLocaleString()} votes)</span>
                </span>
              )}

              <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                {releaseYear}
              </span>

              {movie.runtime > 0 && (
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <IconClock className="w-3.5 h-3.5" />
                  <span>
                    {durationHours > 0 ? `${durationHours}h ` : ""}
                    {durationMinutes}m
                  </span>
                </span>
              )}

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {movie.status === "Released" ? "Đã phát hành" : movie.status || "Hoàn tất"}
              </span>
            </div>

            {/* Genres Chips */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                {movie.genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/explore?with_genres=${g.id}`}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Actions Buttons */}
            <div className="flex md:hidden flex-wrap items-center justify-center gap-2.5 mt-5">
              <button
                onClick={() => setIsPlayingMovie(true)}
                className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/30"
              >
                <IconPlay className="w-4 h-4" />
                <span>Xem Phim</span>
              </button>

              {primaryTrailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <IconFilm className="w-4 h-4 text-primary" />
                  <span>Trailer</span>
                </button>
              )}

              <button
                onClick={() =>
                  inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
                }
                className={`p-2.5 rounded-xl border transition-all ${
                  inList
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <IconHeart className="w-4 h-4" filled={inList} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <IconShare className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Action Buttons bar */}
            <div className="hidden md:flex items-center gap-3 mt-6">
              <button
                onClick={() =>
                  inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
                }
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  inList
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                <IconHeart className="w-4 h-4" filled={inList} />
                <span>{inList ? "Đã Yêu Thích" : "Thêm Yêu Thích"}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <IconShare className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Overview Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Nội dung phim
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {movie.overview || "Hiện chưa có bài tóm tắt chi tiết cho bộ phim này bằng tiếng Việt."}
              </p>
            </div>

            {/* Quick Crew Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800/80 text-left">
              <div>
                <span className="text-xs text-gray-400 block">Đạo diễn</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {director?.name || "Đang cập nhật"}
                </span>
              </div>
              {writers?.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 block">Biên kịch</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {writers.map((w) => w.name).join(", ")}
                  </span>
                </div>
              )}
              <div>
                <span className="text-xs text-gray-400 block">Quốc gia</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {movie.production_countries?.map((c) => c.name).join(", ") || "Quốc tế"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trình Xem Phim Trực Tuyến (Interactive Video Player Section) */}
        {isPlayingMovie && (
          <section className="mt-10 p-4 sm:p-6 rounded-3xl bg-black border border-gray-800 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                <h3 className="font-bold text-sm sm:text-base">
                  Đang phát: {movie.title} (Server VIP CineVerse HD)
                </h3>
              </div>
              <button
                onClick={() => setIsPlayingMovie(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
              >
                Thu nhỏ
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-800">
              {primaryTrailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${primaryTrailer.key}?autoplay=1&rel=0`}
                  title={movie.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                  <IconFilm className="w-12 h-12 text-primary mb-3" />
                  <p className="text-lg font-bold">Trình phát phim bản quyền CineVerse</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-md">
                    Phim đang được bảo lưu bản quyền rạp. Bạn có thể xem các trailer chính thức bên dưới!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Detailed Tabs Header */}
        <div className="mt-12 sm:mt-16 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Thông Tin Chi Tiết" },
              {
                id: "cast",
                label: `Diễn Viên (${movie.credits?.cast?.length || 0})`,
              },
              {
                id: "trailers",
                label: `Trailers & Video (${trailerVideos.length})`,
              },
              { id: "reviews", label: `Đánh Giá (${reviews.length})` },
              {
                id: "similar",
                label: `Phim Tương Tự (${similarMovies.length})`,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="py-8">
          {/* TAB 1: THÔNG TIN CHI TIẾT */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Đạo diễn</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {director?.name || "Chưa rõ"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {movie.status || "Chính thức"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Ngôn ngữ gốc</span>
                  <span className="font-semibold uppercase text-gray-900 dark:text-white">
                    {movie.original_language || "en"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Ngân sách đầu tư</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(movie.budget)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Doanh thu phòng vé</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(movie.revenue)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                  <span className="text-gray-500">Công ty sản xuất</span>
                  <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {movie.production_companies?.map((c) => c.name).join(", ") || "Đang cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIỄN VIÊN (CAST) */}
          {tab === "cast" && (
            <div>
              {movie.credits?.cast?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {movie.credits.cast.slice(0, 18).map((person) => (
                    <CastCard key={person.id} person={person} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-500">
                  Không có thông tin diễn viên cho bộ phim này.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: TRAILERS & VIDEOS */}
          {tab === "trailers" && (
            <div>
              {trailerVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trailerVideos.map((video) => (
                    <div
                      key={video.id || video.key}
                      className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                    >
                      <div className="aspect-video relative w-full bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {video.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {video.type} • YouTube
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-500">
                  Không tìm thấy video hay trailer chính thức nào.
                </p>
              )}
            </div>
          )}

          {/* TAB 4: BÌNH LUẬN & ĐÁNH GIÁ (REVIEWS) */}
          {tab === "reviews" && (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Form Gửi Đánh Giá */}
              <form
                onSubmit={handleAddReview}
                className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <IconSparkles className="w-5 h-5 text-primary" />
                  <span>Viết cảm nhận của bạn</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Tên của bạn (Tùy chọn)"
                    className="p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      Chấm điểm:
                    </span>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="flex-1 p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          ★ {n} / 10 Điểm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Chia sẻ cảm xúc, nội dung phim, diễn xuất, kỹ xảo..."
                  rows={3}
                  className="w-full p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 transition-all"
                >
                  Đăng đánh giá
                </button>
              </form>

              {/* Danh Sách Đánh Giá */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                            {rev.author[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {rev.author}
                            </h4>
                            <span className="text-[10px] text-gray-400">
                              {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center gap-1">
                          <IconStar className="w-3.5 h-3.5" />
                          <span>{rev.rating}/10</span>
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {rev.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500 text-sm">
                    Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên chia sẻ cảm nhận!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PHIM TƯƠNG TỰ */}
          {tab === "similar" && (
            <div>
              {similarMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {similarMovies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-500">
                  Không tìm thấy phim tương tự phù hợp.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          videos={trailerVideos}
          title={`Trailer Chính Thức: ${movie.title}`}
        />
      )}
    </div>
  );
};

export default MovieDetail;
