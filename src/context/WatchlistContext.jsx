import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cv_watchlist") || "[]");
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cv_history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cv_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("cv_history", JSON.stringify(history));
  }, [history]);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist],
  );

  const addToWatchlist = useCallback((movie) => {
    if (!movie || !movie.id) return;
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      toast.success(`Đã thêm "${movie.title || "Phim"}" vào danh sách yêu thích!`, {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#1f2937",
          color: "#fff",
        },
      });
      return [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          overview: movie.overview,
          addedAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => {
      const removed = prev.find((m) => m.id === id);
      toast.success(`Đã xóa "${removed?.title || "Phim"}" khỏi yêu thích`, {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#1f2937",
          color: "#fff",
        },
      });
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    toast.success("Đã xóa tất cả phim khỏi danh sách yêu thích");
  }, []);

  const addToHistory = useCallback((movie) => {
    if (!movie || !movie.id) return;
    setHistory((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      return [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          watchedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 50);
    });
  }, []);

  const removeFromHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((m) => m.id !== id));
    toast.success("Đã xóa khỏi lịch sử xem");
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast.success("Đã xóa toàn bộ lịch sử xem");
  }, []);

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      clearWatchlist,
      isInWatchlist,
      history,
      addToHistory,
      removeFromHistory,
      clearHistory,
    }),
    [
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      clearWatchlist,
      isInWatchlist,
      history,
      addToHistory,
      removeFromHistory,
      clearHistory,
    ],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist phải được sử dụng bên trong WatchlistProvider");
  }
  return context;
};
