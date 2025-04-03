import useUserStore from "../store/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar";

function DashboardMain() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) navigate("/login"); // token이 없으면 로그인 페이지로 이동
  }, [user, navigate]);


  return (
    <motion.div className="flex min-h-screen bg-gray-50 dark:bg-black">

      <div className="flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          👋 안녕하세요, {user?.name || user?.userId}님!
        </h1>

      </div>
    </motion.div>
  );
}

export default DashboardMain;
