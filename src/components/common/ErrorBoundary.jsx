import { Component } from "react";
import { IconFilm } from "./Icons";

class ErrorBoundary extends Component {
  state = { hasError: false, errorInfo: null };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-50 dark:bg-[#0b0f17] text-gray-900 dark:text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
            <IconFilm className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            Đã xảy ra sự cố kỹ thuật 🎬
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Hệ thống phát hiện lỗi khi dựng giao diện. Bạn hãy tải lại trang hoặc quay về trang chủ.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all"
            >
              Tải lại trang
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold transition-all"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
