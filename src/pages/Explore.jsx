import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { discoverMovies, getGenres } from "../services/tmdbApi";
import MovieCard from "../components/movie/MovieCard";
import { MovieCardSkeleton } from "../components/common/Skeleton";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IconFilter, IconSparkles } from "../components/common/Icons";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Suy ra filter trực tiếp từ searchParams (Single Source of Truth)
  const with_genres = searchParams.get("with_genres") || "";
  const sort_by = searchParams.get("sort_by") || "popularity.desc";
  const primary_release_year = searchParams.get("primary_release_year") || "";
  const vote_average_gte = searchParams.get("vote_average.gte") || "";

  // Tải danh sách thể loại từ TMDB một lần
  useEffect(() => {
    let isMounted = true;
    getGenres()
      .then((d) => {
        if (isMounted) setGenres(d.genres || []);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  // Khi tiêu chí lọc URL thay đổi, fetch trang 1
  useEffect(() => {
    let isMounted = true;

    const fetchFirstPage = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page: 1,
          with_genres,
          sort_by,
          primary_release_year,
          "vote_average.gte": vote_average_gte,
        };
        Object.keys(queryParams).forEach((k) => {
          if (!queryParams[k]) delete queryParams[k];
        });

        const data = await discoverMovies(queryParams);
        if (isMounted) {
          setMovies(data.results || []);
          setHasMore(1 < (data.total_pages || 1));
          setPage(1);
        }
      } catch (err) {
        console.error("Lỗi khi tải explore:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchFirstPage();

    return () => {
      isMounted = false;
    };
  }, [with_genres, sort_by, primary_release_year, vote_average_gte]);

  // Tải trang tiếp theo khi cuộn vô tận
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const queryParams = {
        page: nextPage,
        with_genres,
        sort_by,
        primary_release_year,
        "vote_average.gte": vote_average_gte,
      };
      Object.keys(queryParams).forEach((k) => {
        if (!queryParams[k]) delete queryParams[k];
      });

      const data = await discoverMovies(queryParams);
      setMovies((prev) => [...prev, ...(data.results || [])]);
      setHasMore(nextPage < (data.total_pages || 1));
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, with_genres, sort_by, primary_release_year, vote_average_gte]);

  const sentinelRef = useInfiniteScroll(
    () => {
      if (hasMore && !loading && !isInitialLoad) {
        loadMore();
      }
    },
    hasMore,
    loading,
  );

  const handleFilterChange = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    with_genres ||
      primary_release_year ||
      vote_average_gte ||
      sort_by !== "popularity.desc",
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Tiêu đề & Mô tả */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Khám Phá Phim
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Lọc và tìm kiếm hàng ngàn bộ phim theo sở thích, thể loại và đánh giá
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-primary transition-colors"
          >
            ✕ Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Thanh Điều Khiển Bộ Lọc (Filter Bar) */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <IconFilter className="w-4 h-4 text-primary" />
          <span>Bộ lọc nâng cao</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Lọc thể loại */}
          <select
            value={with_genres}
            onChange={(e) => handleFilterChange("with_genres", e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-primary"
          >
            <option value="">Tất cả thể loại</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Sắp xếp */}
          <select
            value={sort_by}
            onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-primary"
          >
            <option value="popularity.desc">🔥 Phổ biến nhất</option>
            <option value="vote_average.desc">⭐ Đánh giá cao nhất</option>
            <option value="primary_release_date.desc">📅 Mới phát hành</option>
            <option value="revenue.desc">💰 Doanh thu khủng</option>
          </select>

          {/* Lọc năm */}
          <input
            type="number"
            placeholder="Năm phát hành (VD: 2024)"
            min="1950"
            max="2030"
            value={primary_release_year}
            onChange={(e) =>
              handleFilterChange("primary_release_year", e.target.value)
            }
            className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-primary"
          />

          {/* Đánh giá tối thiểu */}
          <select
            value={vote_average_gte}
            onChange={(e) =>
              handleFilterChange("vote_average.gte", e.target.value)
            }
            className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-primary"
          >
            <option value="">Tất cả điểm số</option>
            <option value="8">Tác phẩm xuất sắc (8+ ⭐)</option>
            <option value="7">Phim hay nên xem (7+ ⭐)</option>
            <option value="6">Được xem nhiều (6+ ⭐)</option>
          </select>
        </div>

        {/* Quick Genre Pills (Thể loại nhanh phổ biến) */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-gray-400 whitespace-nowrap mr-1">
            Gợi ý nhanh:
          </span>
          {genres.slice(0, 8).map((g) => (
            <button
              key={g.id}
              onClick={() =>
                handleFilterChange(
                  "with_genres",
                  String(with_genres) === String(g.id) ? "" : String(g.id),
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                String(with_genres) === String(g.id)
                  ? "bg-primary text-white font-bold"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh Sách Phim */}
      {isInitialLoad && loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {[...Array(12)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {movies.map((m) => (
            <MovieCard key={`${m.id}-${m.title}`} movie={m} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <IconSparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Không tìm thấy phim phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Thử thay đổi bộ lọc thể loại, năm chiếu hoặc giảm tiêu chí đánh giá để khám phá thêm nhiều tác phẩm khác.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-md shadow-primary/30 transition-all"
          >
            Xem tất cả phim phổ biến
          </button>
        </div>
      )}

      {/* Sentinel cho Infinite Scroll */}
      <div ref={sentinelRef} className="h-10 my-4 flex items-center justify-center">
        {loading && !isInitialLoad && (
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Đang tải thêm phim...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
