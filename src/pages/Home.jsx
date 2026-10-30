import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getImageUrl,
} from "../services/tmdbApi";
import MovieRow from "../components/movie/MovieRow";

const Home = () => {
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    loading: true,
  });

  useEffect(() => {
    Promise.all([getTrending(), getPopular(), getTopRated(), getUpcoming()])
      .then(([t, p, tr, u]) =>
        setData({
          trending: t.results,
          popular: p.results,
          topRated: tr.results,
          upcoming: u.results,
          loading: false,
        }),
      )
      .catch(console.error);
  }, []);

  if (data.loading)
    return (
      <div className="h-screen flex items-center justify-center dark:text-white">
        Đang tải dữ liệu...
      </div>
    );
  const hero = data.trending.slice(0, 5);

  return (
    <div className="pb-16">
      <section className="relative h-[60vh] md:h-[80vh]">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {hero.map((m) => (
            <SwiperSlide key={m.id}>
              <div className="relative h-full">
                <img
                  src={getImageUrl(m.backdrop_path, "original")}
                  className="w-full h-full object-cover"
                  alt={m.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-2xl">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                    {m.title}
                  </h1>
                  <p className="text-gray-300 line-clamp-3 mb-4">
                    {m.overview}
                  </p>
                  <Link
                    to={`/movie/${m.id}`}
                    className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium inline-block"
                  >
                    Xem ngay
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="container mx-auto px-4 mt-8">
        <MovieRow title="Phim thịnh hành" movies={data.trending} />
        <MovieRow title="Phim đánh giá cao" movies={data.topRated} />
        <MovieRow title="Phim sắp chiếu" movies={data.upcoming} />
        <MovieRow title="Phim phổ biến" movies={data.popular} />
      </div>
    </div>
  );
};
export default Home;
