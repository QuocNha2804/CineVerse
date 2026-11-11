import ImageWithFallback from "../common/ImageWithFallback";
import { getImageUrl } from "../../services/tmdbApi";

const CastCard = ({ person }) => {
  if (!person) return null;
  const avatarUrl = getImageUrl(person.profile_path, "w185");

  return (
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-primary/20 group-hover:border-primary transition-colors shadow-inner bg-gray-100 dark:bg-gray-800">
        <ImageWithFallback
          src={avatarUrl}
          alt={person.name}
          fallbackText={person.name?.[0] || "A"}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 w-full">
        {person.name}
      </h4>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 w-full mt-0.5">
        {person.character || "Diễn viên"}
      </p>
    </div>
  );
};

export default CastCard;
