import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import { User, CalendarDays, Smile, BadgeInfo, Lock, Sun, Moon } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    password: "",
    name: "",
    nickname: "",
    birthday: "",
  });
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.title = "퐁당 | 회원가입 💧";
  }, []);


  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("darkMode", next);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/signup", form);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      setError("회원가입 실패: " + (err.response?.data || "오류가 발생했습니다."));
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
            onClick={toggleDark}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            
        </button>

        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
          퐁당 회원가입 💧
        </h1>

        {error && <p className="text-sm text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 아이디 */}
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

          {/* 비밀번호 */}
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

          {/* 이름 */}
          <div className="relative">
            <BadgeInfo className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 별명 */}
          <div className="relative">
            <Smile className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="nickname"
              placeholder="별명"
              value={form.nickname}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 생일 */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              name="birthday"
              placeholder="생일"
              value={form.birthday}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            회원가입
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
