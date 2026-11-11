import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getMovieDetail,
  getImageUrl,
} from "../services/tmdbApi";
import MovieRow from "../components/movie/MovieRow";
import TrailerModal from "../components/movie/TrailerModal";
import { MovieRowSkeleton } from "../components/common/Skeleton";
import {
  IconPlay,
  IconStar,
  IconHeart,
  IconFlame,
  IconSparkles,
  IconFilm,
  IconClock,
} from "../components/common/Icons";
import { useWatchlist } from "../context/WatchlistContext";

const Home = () => {
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    loading: true,
    error: null,
  });

  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      getTrending("week"),
      getPopular(1),
      getTopRated(1),
      getUpcoming(1),
    ])
      .then(([tRes, pRes, trRes, uRes]) => {
        if (!isMounted) return;

        setData({
          trending: tRes.status === "fulfilled" ? tRes.value.results || [] : [],
          popular: pRes.status === "fulfilled" ? pRes.value.results || [] : [],
          topRated:
            trRes.status === "fulfilled" ? trRes.value.results || [] : [],
          upcoming: uRes.status === "fulfilled" ? uRes.value.results || [] : [],
          loading: false,
          error:
            tRes.status === "rejected" && pRes.status === "rejected"
              ? "Không thể tải danh sách phim. Vui lòng kiểm tra kết nối mạng."
              : null,
        });
      })
      .catch((err) => {
        if (isMounted) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "Đã xảy ra lỗi khi kết nối TMDB: " + err.message,
          }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenTrailer = async (movie) => {
    try {
      const detail = await getMovieDetail(movie.id);
      setActiveTrailer(detail);
      setIsTrailerOpen(true);
    } catch {
      setActiveTrailer(movie);
      setIsTrailerOpen(true);
    }
  };

  if (data.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Banner Skeleton */}
        <div className="w-full h-[55vh] md:h-[70vh] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse mb-10" />
        {/* Row Skeletons */}
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    );
  }

  if (data.error && data.trending.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-primary flex items-center justify-center mb-4">
          <IconFilm className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Không thể tải dữ liệu
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          {data.error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  const heroMovies = data.trending.slice(0, 6);

  return (
    <div className="pb-16 animate-fade-in">
      {/* Hero Banner Slider */}
      {heroMovies.length > 0 && (
        <section className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] max-h-[850px] overflow-hidden bg-black">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            effect="fade"
            loop={heroMovies.length > 1}
            className="h-full w-full"
          >
            {heroMovies.map((m) => {
              const inList = isInWatchlist(m.id);
              const backdropUrl = getImageUrl(m.backdrop_path, "original");
              const rating = m.vote_average ? m.vote_average.toFixed(1) : null;
              const year = m.release_date?.split("-")[0];

              return (
                <SwiperSlide key={m.id} className="relative h-full w-full">
                  <div className="relative h-full w-full">
                    {/* Ảnh Nền Backdrop */}
                    <img
                      src={backdropUrl}
                      alt={m.title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Gradient Che Tối Điện Ảnh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/50 to-transparent hidden md:block" />

                    {/* Khối Nội Dung Banner */}
                    <div className="absolute inset-0 container mx-auto px-4 md:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 max-w-3xl">
                      {/* Huy Hiệu Phim Hot */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-primary text-white tracking-wider uppercase shadow-lg shadow-primary/40 flex items-center gap-1.5">
                          <IconFlame className="w-3.5 h-3.5" />
                          Thịnh hành số #1
                        </span>
                        {year && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white">
                            {year}
                          </span>
                        )}
                        {rating && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white flex items-center gap-1">
                            <IconStar className="w-3.5 h-3.5" />
                            {rating}
                          </span>
                        )}
                      </div>

                      {/* Tiêu Đề Phim */}
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-tight line-clamp-2 drop-shadow-lg">
                        {m.title}
                      </h1>

                      {/* Tóm Tắt */}
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl leading-relaxed drop-shadow">
                        {m.overview || "Một tác phẩm điện ảnh xuất sắc đang làm mưa làm gió trên bảng xếp hạng toàn cầu."}
                      </p>

                      {/* Nút Hành Động */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                          to={`/movie/${m.id}`}
                          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                          <IconPlay className="w-4 h-4" />
                          <span>Xem ngay</span>
                        </Link>

                        <button
                          onClick={() => handleOpenTrailer(m)}
                          className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/20 active:scale-95 transition-all"
                        >
                          <IconFilm className="w-4 h-4" />
                          <span>Trailer</span>
                        </button>

                        <button
                          onClick={() =>
                            inList ? removeFromWatchlist(m.id) : addToWatchlist(m)
                          }
                          aria-label="Lưu vào danh sách"
                          className={`p-3 rounded-xl backdrop-blur-md border transition-all active:scale-90 ${
                            inList
                              ? "bg-primary border-primary text-white"
                              : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                          }`}
                        >
                          <IconHeart className="w-4 h-4" filled={inList} />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}

      {/* Feature Highlights Bar */}
      <section className="container mx-auto px-4 -mt-6 sm:-mt-8 relative z-20 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-black/5">
          <div className="flex items-center gap-3.5 px-2">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-primary/20 text-primary">
              <IconFilm className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Kho Phim Đa Dạng
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Hàng ngàn tác phẩm bom tấn cập nhật liên tục
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-800 pt-3 sm:pt-0">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-500">
              <IconStar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Đánh Giá Độc Quyền
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Điểm số TMDB và bình luận chân thực từ người xem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-800 pt-3 sm:pt-0">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500">
              <IconClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Đồng Bộ Cá Nhân
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Lưu danh sách yêu thích và lịch sử xem tức thì
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Rows */}
      <div className="container mx-auto px-4 space-y-6 sm:space-y-8">
        <MovieRow
          title="Phim thịnh hành trong tuần"
          movies={data.trending}
          icon={IconFlame}
          exploreUrl="/explore?sort_by=popularity.desc"
        />
        <MovieRow
          title="Được khán giả đánh giá cao nhất"
          movies={data.topRated}
          icon={IconStar}
          exploreUrl="/explore?sort_by=vote_average.desc"
        />
        <MovieRow
          title="Phim sắp ra mắt rạp"
          movies={data.upcoming}
          icon={IconSparkles}
          exploreUrl="/explore?sort_by=release_date.desc"
        />
        <MovieRow
          title="Được quan tâm nhiều nhất"
          movies={data.popular}
          icon={IconFilm}
          exploreUrl="/explore?sort_by=popularity.desc"
        />
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && activeTrailer && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          videos={activeTrailer?.videos?.results || []}
          title={`Trailer - ${activeTrailer.title}`}
        />
      )}
    </div>
  );
};

export default Home;
