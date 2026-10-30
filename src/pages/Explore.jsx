import { useState, useEffect, useCallback } from "react";
import { discoverMovies, getGenres } from "../services/tmdbApi";
import MovieCard from "../components/movie/MovieCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    with_genres: "",
    primary_release_year: "",
    "vote_average.gte": "",
    sort_by: "popularity.desc",
  });

  useEffect(() => {
    getGenres().then((d) => setGenres(d.genres));
  }, []);

  const fetchMovies = useCallback(
    async (pageNum, reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const params = { page: pageNum, ...filters };
        Object.keys(params).forEach(
          (k) => params[k] === "" && delete params[k],
        );
        const data = await discoverMovies(params);
        setMovies((prev) =>
          reset ? data.results : [...prev, ...data.results],
        );
        setHasMore(pageNum < data.total_pages);
        setPage(pageNum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [filters, loading],
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [filters]);

  const sentinelRef = useInfiniteScroll(
    () => {
      if (hasMore && !loading) fetchMovies(page + 1);
    },
    hasMore,
    loading,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Khám phá</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        <select
          value={filters.with_genres}
          onChange={(e) =>
            setFilters({ ...filters, with_genres: e.target.value })
          }
          className="p-2 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">Thể loại</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Năm"
          value={filters.primary_release_year}
          onChange={(e) =>
            setFilters({ ...filters, primary_release_year: e.target.value })
          }
          className="p-2 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <select
          value={filters["vote_average.gte"]}
          onChange={(e) =>
            setFilters({ ...filters, "vote_average.gte": e.target.value })
          }
          className="p-2 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">Đánh giá</option>
          <option value="7">7+ ⭐</option>
          <option value="8">8+ ⭐</option>
        </select>
        <select
          value={filters.sort_by}
          onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
          className="p-2 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="popularity.desc">Phổ biến</option>
          <option value="vote_average.desc">Đánh giá cao</option>
          <option value="release_date.desc">Mới nhất</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4"></div>
      {loading && (
        <p className="text-center mt-4 dark:text-gray-400">Đang tải...</p>
      )}
    </div>
  );
};
export default Explore;
