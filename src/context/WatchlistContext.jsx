import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() =>
    JSON.parse(localStorage.getItem("cv_watchlist") || "[]"),
  );
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("cv_history") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("cv_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);
  useEffect(() => {
    localStorage.setItem("cv_history", JSON.stringify(history));
  }, [history]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      toast.success(`Đã thêm "${movie.title}"`);
      return [...prev, movie];
    });
  };
  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => {
      toast.success("Đã xóa khỏi yêu thích");
      return prev.filter((m) => m.id !== id);
    });
  };
  const clearWatchlist = () => {
    setWatchlist([]);
    toast.success("Đã xóa tất cả");
  };
  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const addToHistory = (movie) => {
    setHistory((prev) =>
      [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          watchedAt: Date.now(),
        },
        ...prev.filter((m) => m.id !== movie.id),
      ].slice(0, 50),
    );
  };
  const clearHistory = () => {
    setHistory([]);
    toast.success("Đã xóa lịch sử");
  };

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      clearWatchlist,
      isInWatchlist,
      history,
      addToHistory,
      clearHistory,
    }),
    [watchlist, history],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
export const useWatchlist = () => useContext(WatchlistContext);
