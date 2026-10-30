import ImageWithFallback from "../common/ImageWithFallback";
import { getImageUrl } from "../../services/tmdbApi";

const CastCard = ({ person }) => (
  <div className="text-center">
    <ImageWithFallback
      src={getImageUrl(person.profile_path, "w185")}
      fallback="https://via.placeholder.com/185x185?text=No+Avatar"
      className="w-full aspect-square object-cover rounded-full mb-2"
      alt={person.name}
    />
    <p className="text-sm font-medium dark:text-white line-clamp-1">
      {person.name}
    </p>
    <p className="text-xs text-gray-500 line-clamp-1">{person.character}</p>
  </div>
);
export default CastCard;
