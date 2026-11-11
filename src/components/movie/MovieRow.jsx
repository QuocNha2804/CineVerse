import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies, icon: Icon, exploreUrl = "/explore" }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>

        <Link
          to={exploreUrl}
          className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group transition-colors"
        >
          <span>Xem tất cả</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={12}
        slidesPerView={2.2}
        breakpoints={{
          480: { slidesPerView: 2.5, spaceBetween: 14 },
          640: { slidesPerView: 3.2, spaceBetween: 16 },
          768: { slidesPerView: 4.2, spaceBetween: 16 },
          1024: { slidesPerView: 5.2, spaceBetween: 18 },
          1280: { slidesPerView: 6, spaceBetween: 20 },
        }}
        className="!overflow-visible py-2"
      >
        {movies.map((m) => (
          <SwiperSlide key={m.id} className="h-auto">
            <MovieCard movie={m} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieRow;
