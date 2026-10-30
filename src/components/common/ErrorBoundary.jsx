import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:text-white">
          <h1 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra 😵</h1>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg"
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
