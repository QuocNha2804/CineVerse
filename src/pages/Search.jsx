import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/tmdbApi";
import { useDebounce } from "../hooks/useDebounce";
import MovieCard from "../components/movie/MovieCard";
import { MovieCardSkeleton } from "../components/common/Skeleton";
import { IconSearch, IconClose, IconSparkles } from "../components/common/Icons";

const POPULAR_SEARCHES = [
  "Avengers",
  "Spider-Man",
  "Batman",
  "Harry Potter",
  "Anime",
  "Dune",
  "Oppenheimer",
  "John Wick",
  "Fast & Furious",
  "Avatar",
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));

  // Khi debouncedQuery thay đổi
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      void Promise.resolve().then(() => {
        setResults([]);
        setLoading(false);
        setHasSearched(false);
      });
      return;
    }

    setSearchParams({ q: trimmed });
    let isMounted = true;

    const performSearch = async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchMovies(trimmed, 1);
        if (isMounted) {
          setResults(data.results || []);
        }
      } catch (err) {
        if (isMounted) console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void Promise.resolve().then(performSearch);

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, setSearchParams]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const handleQuickKeyword = (kw) => {
    setQuery(kw);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in min-h-[75vh]">
      {/* Search Header Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white text-center mb-2 tracking-tight">
          Tìm Kiếm Phim
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Nhập tên phim, diễn viên hoặc từ khóa bạn muốn khám phá
        </p>

        {/* Ô Tìm Kiếm Hiện Đại */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: Spider-Man, Kẻ Hủy Diệt, Conan..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 shadow-lg shadow-black/5 dark:shadow-black/20 focus:outline-none focus:border-primary transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch className="w-5 h-5" />
          </div>

          {query && (
            <button
              onClick={handleClear}
              aria-label="Xóa nội dung tìm kiếm"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <IconClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Gợi Ý Từ Khóa Xu Hướng */}
        <div className="mt-4 flex items-center gap-1.5 flex-wrap justify-center text-xs">
          <span className="text-gray-400 font-medium flex items-center gap-1">
            <IconSparkles className="w-3.5 h-3.5 text-amber-500" />
            Gợi ý xu hướng:
          </span>
          {POPULAR_SEARCHES.map((kw) => (
            <button
              key={kw}
              onClick={() => handleQuickKeyword(kw)}
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Kết Quả Tìm Kiếm */}
      <div>
        {loading ? (
          <div className="space-y-4">
            <p className="text-center text-xs font-semibold text-gray-400">
              Đang tìm kiếm kết quả cho "{query}"...
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[...Array(12)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Tìm thấy{" "}
                <span className="text-primary font-black">
                  {results.length}
                </span>{" "}
                kết quả cho "{debouncedQuery}"
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {results.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        ) : hasSearched && debouncedQuery.trim() ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <IconSearch className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
              Không có bộ phim nào khớp với từ khóa "{debouncedQuery}". Hãy kiểm tra lại chính tả hoặc thử một từ khóa khác.
            </p>
            <button
              onClick={handleClear}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/30 transition-all"
            >
              Tìm phim khác
            </button>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xs sm:text-sm">
              Nhập từ khóa bất kỳ ở thanh tìm kiếm phía trên để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
