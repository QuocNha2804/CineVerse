import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import toast from "react-hot-toast";
import {
  IconUser,
  IconSun,
  IconMoon,
  IconHeart,
  IconClock,
  IconSparkles,
} from "../components/common/Icons";

const AVATAR_LIST = [
  { id: "avatar1", emoji: "🦸‍♂️", label: "Siêu Anh Hùng" },
  { id: "avatar2", emoji: "🥷", label: "Ninja Bóng Đêm" },
  { id: "avatar3", emoji: "🧙‍♂️", label: "Phù Thủy Cổ Đại" },
  { id: "avatar4", emoji: "🍿", label: "Tín Đồ Bắp Rang" },
  { id: "avatar5", emoji: "🎬", label: "Đạo Diễn Vàng" },
  { id: "avatar6", emoji: "👽", label: "Người Ngoài Hành Tinh" },
];

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { watchlist, history } = useWatchlist();

  const [name, setName] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || "avatar1",
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tên hiển thị không được để trống");
      return;
    }
    updateProfile({ name: name.trim(), avatar: selectedAvatar });
    toast.success("Đã cập nhật thông tin hồ sơ!", { icon: "✅" });
  };

  const currentAvatarObj =
    AVATAR_LIST.find((a) => a.id === selectedAvatar) || AVATAR_LIST[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-rose-500 text-white text-4xl flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
            {currentAvatarObj.emoji}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {user?.name || "Khán Giả"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {user?.email || "Chưa cập nhật email"}
                </p>
              </div>

              <span className="self-center sm:self-start px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Thành viên CineVerse VIP</span>
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <IconHeart className="w-4 h-4" filled />
                  <span className="text-xl font-black">{watchlist.length}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  Phim yêu thích
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <IconClock className="w-4 h-4" />
                  <span className="text-xl font-black">{history.length}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  Phim trong lịch sử
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Card */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-6"
      >
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <IconUser className="w-5 h-5 text-primary" />
          <span>Thông tin cá nhân & Giao diện</span>
        </h3>

        {/* Chọn Avatar */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Chọn hình đại diện
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {AVATAR_LIST.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedAvatar(av.id)}
                className={`p-3 rounded-2xl text-2xl flex flex-col items-center gap-1 transition-all ${
                  selectedAvatar === av.id
                    ? "bg-primary/10 border-2 border-primary scale-105 shadow-md shadow-primary/20"
                    : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>{av.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 line-clamp-1">
                  {av.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Đổi Tên Hiển Thị */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Tên hiển thị
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Chọn Chế Độ Sáng/Tối */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Chế độ giao diện (Theme)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Tối (Rạp phim)", icon: IconMoon },
              { id: "light", label: "Sáng (Hiện đại)", icon: IconSun },
              { id: "system", label: "Theo hệ thống", icon: IconSparkles },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 border transition-all ${
                    theme === t.id
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            Lưu thay đổi
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/30 transition-all sm:ml-auto"
          >
            Đăng xuất tài khoản
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
