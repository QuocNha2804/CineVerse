import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/tmdbApi";
import { useDebounce } from "../hooks/useDebounce";
import MovieCard from "../components/movie/MovieCard";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setSearchParams({ q: debouncedQuery });
    setLoading(true);
    searchMovies(debouncedQuery)
      .then((d) => setResults(d.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery, setSearchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm phim..."
        className="w-full max-w-2xl mx-auto block p-4 text-lg rounded-xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary mb-8"
      />
      {loading ? (
        <p className="text-center dark:text-gray-400">Đang tìm kiếm...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : query ? (
        <p className="text-center text-gray-500 py-10">
          Không tìm thấy phim nào cho "{query}"
        </p>
      ) : null}
    </div>
  );
};
export default Search;
