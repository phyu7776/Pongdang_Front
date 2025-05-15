import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useThemeStore from "../store/themeStore";

function Login() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    document.title = "퐁당 | 로그인 💧";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.userId, form.password);
    } catch (error) {
      if (error.response?.status === 400) {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      } else if (error.response?.status === 423) {
        setError('승인되지 않은 계정입니다. 관리자의 승인을 기다려주세요.');
      }
    } finally {
      setLoading(false);
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
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
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
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          아직 계정이 없나요?{" "}
          <Link
            to="/register"
            className="text-blue-500 dark:text-blue-400 hover:underline font-medium"
          >
            회원가입
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
