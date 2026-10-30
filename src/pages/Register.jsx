import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Đăng ký thành công");
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
          Đăng ký
        </h2>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
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
          Đăng ký
        </button>
        <p className="text-sm text-center dark:text-gray-300">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primary">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};
