export const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-800/80 rounded ${className}`}
  />
);

export const MovieCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 p-2 shadow-sm">
    <div className="w-full aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
    <div className="pt-2.5 pb-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5 animate-pulse" />
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
);

export const MovieRowSkeleton = () => (
  <div className="mb-10">
    <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Skeleton;
