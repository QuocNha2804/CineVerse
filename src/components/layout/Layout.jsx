import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="pt-16 pb-16">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 border-t dark:border-gray-800">
        © 2026 CineVerse. Dữ liệu từ TMDB.
      </footer>
    </div>
  );
};
export default Layout;
