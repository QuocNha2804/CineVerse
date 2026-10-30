import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    updateProfile({ name });
    toast.success("Đã lưu thay đổi");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Hồ sơ</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
        <div>
          <label className="block text-sm mb-2 dark:text-gray-300">
            Tên hiển thị
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-2 dark:text-gray-300">
            Giao diện
          </label>
          <div className="flex gap-2">
            {["light", "dark", "system"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${theme === t ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {watchlist.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phim yêu thích
            </p>
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t dark:border-gray-700">
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Lưu
          </button>
          <button
            onClick={logout}
            className="text-red-500 px-6 py-2 rounded-lg border border-red-500"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
