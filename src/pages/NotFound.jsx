import { Link } from "react-router-dom";
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-[70vh]">
    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
    <p className="text-xl mb-6 dark:text-white">Trang không tồn tại</p>
    <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg">
      Về trang chủ
    </Link>
  </div>
);
export default NotFound;
