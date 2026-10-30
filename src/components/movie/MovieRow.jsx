import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 dark:text-white px-2">
        {title}
      </h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="px-2"
      >
        {movies.map((m) => (
          <SwiperSlide key={m.id}>
            <MovieCard movie={m} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default MovieRow;
