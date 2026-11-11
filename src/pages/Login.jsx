import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { IconFilm, IconUser } from "../components/common/Icons";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công! Chào mừng trở lại.", {
        icon: "🍿",
      });
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  // Nút 1-click tạo hoặc đăng nhập bằng tài khoản demo
  const handleQuickDemo = async () => {
    const demoEmail = "demo@cineverse.vn";
    const demoPass = "123456";
    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      await login(demoEmail, demoPass);
      toast.success("Đăng nhập tài khoản trải nghiệm thành công!", {
        icon: "✨",
      });
      navigate("/");
    } catch {
      // Nếu chưa có tài khoản demo thì tự động đăng ký luôn
      try {
        await register("Khán Giả VIP", demoEmail, demoPass);
        toast.success("Tạo và đăng nhập tài khoản trải nghiệm thành công!", {
          icon: "🎉",
        });
        navigate("/");
      } catch (err) {
        toast.error("Lỗi demo: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-2xl shadow-black/10">
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-rose-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/30">
            <IconFilm className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Đăng Nhập CineVerse
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Đăng nhập để đồng bộ danh sách phim yêu thích và lịch sử xem
          </p>
        </div>

        {/* Demo Fast Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full mb-5 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>⚡ Bấm vào đây để thử ngay tài khoản Khách (Demo)</span>
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <input
              type="email"
              placeholder="tenban@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <IconUser className="w-4 h-4" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-bold ml-1"
          >
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
