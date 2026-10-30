import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form
        onSubmit={handle}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center dark:text-white">
          Đăng nhập
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg"
        >
          Đăng nhập
        </button>
        <p className="text-sm text-center dark:text-gray-300">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-primary">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
};
