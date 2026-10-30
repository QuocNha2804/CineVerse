import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
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
export const getMovieDetail = (id) =>
  api
    .get(`/movie/${id}`, {
      params: { append_to_response: "videos,credits,similar" },
    })
    .then((res) => res.data);
export const searchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page } }).then((res) => res.data);
export const discoverMovies = (params) =>
  api.get("/discover/movie", { params }).then((res) => res.data);

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
