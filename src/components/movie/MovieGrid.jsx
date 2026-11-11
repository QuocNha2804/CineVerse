import MovieCard from "./MovieCard";

const MovieGrid = ({ movies = [], showRemove = false, emptyMessage = "Không có phim nào để hiển thị." }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} showRemove={showRemove} />
      ))}
    </div>
  );
};

export default MovieGrid;
