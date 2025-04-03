import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Moon, Sun } from "lucide-react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(true);

  const toggleDark = () => {
    setIsDark(!isDark);
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/users/login", form, {
        withCredentials: true
      }) ;
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition bg-gray-100 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl px-10 py-12 w-full max-w-md relative"
      >
        {/* 다크모드 토글 */}
        <button
          onClick={toggleDark}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
          퐁당 로그인 💧
        </h1>

        {error && (
          <p className="text-sm text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={form.userId}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          아직 계정이 없나요?{" "}
          <a
            href="/register"
            className="text-blue-500 dark:text-blue-400 hover:underline font-medium"
          >
            회원가입
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
