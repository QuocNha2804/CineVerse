import { useState } from "react";

const ImageWithFallback = ({
  src,
  alt = "Movie poster",
  className = "",
  fallbackText = "Không có ảnh",
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset state khi src thay đổi mà không cần useEffect (React recommended pattern)
  if (prevSrc !== src) {
    setPrevSrc(src);
    setError(false);
    setLoading(true);
  }

  if (!src || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 p-4 text-center select-none ${className}`}
      >
        <svg
          className="w-10 h-10 mb-2 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        <span className="text-xs font-medium line-clamp-1">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
