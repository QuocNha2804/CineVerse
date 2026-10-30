import { useEffect, useRef, useCallback } from "react";
export const useInfiniteScroll = (onLoadMore, hasMore, loading) => {
  const sentinelRef = useRef(null);
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) onLoadMore();
    },
    [onLoadMore, hasMore, loading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
      threshold: 0,
    });
    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver]);
  return sentinelRef;
};
