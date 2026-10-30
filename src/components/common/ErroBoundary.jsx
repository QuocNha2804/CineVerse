import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <p className="text-6xl mb-4">😵</p>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">
            Đã có lỗi xảy ra
          </h1>
          <p className="text-gray-500 mb-6">Vui lòng thử lại sau.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2.5 rounded-lg"
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
