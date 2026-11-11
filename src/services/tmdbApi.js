import axios from "axios";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "db70379f1d3cfc6062473a65c20dae88";
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "vi-VN",
  },
});

export const getTrending = (timeWindow = "week") =>
  api.get(`/trending/movie/${timeWindow}`).then((res) => res.data);

export const getPopular = (page = 1) =>
  api.get("/movie/popular", { params: { page } }).then((res) => res.data);

export const getTopRated = (page = 1) =>
  api.get("/movie/top_rated", { params: { page } }).then((res) => res.data);

export const getUpcoming = (page = 1) =>
  api.get("/movie/upcoming", { params: { page } }).then((res) => res.data);

export const getGenres = () =>
  api.get("/genre/movie/list").then((res) => res.data);

export const getMovieDetail = async (id) => {
  try {
    const res = await api.get(`/movie/${id}`, {
      params: { append_to_response: "videos,credits,similar,recommendations" },
    });
    const data = res.data;

    // Nếu không có trailer tiếng Việt, fallback lấy trailer tiếng Anh để người dùng xem được
    const hasTrailer = data.videos?.results?.some(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    );

    if (!hasTrailer) {
      try {
        const enVideos = await api.get(`/movie/${id}/videos`, {
          params: { language: "en-US" },
        });
        if (enVideos.data.results?.length) {
          data.videos = {
            results: [...(data.videos?.results || []), ...enVideos.data.results],
          };
        }
      } catch {
        // bỏ qua lỗi fallback
      }
    }

    return data;
  } catch (error) {
    console.error("Lỗi tải chi tiết phim:", error);
    throw error;
  }
};

export const searchMovies = (query, page = 1) =>
  api
    .get("/search/movie", {
      params: { query, page, include_adult: false },
    })
    .then((res) => res.data);

export const discoverMovies = (params) =>
  api.get("/discover/movie", { params }).then((res) => res.data);

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
