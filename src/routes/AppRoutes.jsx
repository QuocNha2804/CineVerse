import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

// Code splitting các trang bằng lazy loading
const Home = lazy(() => import("../pages/Home"));
const Explore = lazy(() => import("../pages/Explore"));
const Search = lazy(() => import("../pages/Search"));
const MovieDetail = lazy(() => import("../pages/MovieDetail"));
const Watchlist = lazy(() => import("../pages/Watchlist"));
const History = lazy(() => import("../pages/History"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PageLoading = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-xs font-semibold text-gray-400">Đang tải trang...</span>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoading />}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
