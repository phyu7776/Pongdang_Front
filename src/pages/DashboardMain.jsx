import { useEffect, useState } from "react";
import { useMenuStore } from "../store/menuStore";
import useUserStore from "../store/userStore";
import { users } from "../api/endpoints";
import Calendar from "react-calendar";
import '../styles/Calendar.css';
import { Activity, Clock, Plus, ChevronRight, BarChart2, Users, Target } from 'lucide-react';

function DashboardMain() {
  const { fetchMenus } = useMenuStore();
  const { user } = useUserStore();
  const [date, setDate] = useState(new Date());
  const [teamStats, setTeamStats] = useState({ totalCount: 0, users: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "퐁당 | 대시보드 📊";
    fetchMenus();
    fetchTeamStats();
  }, []);

  const fetchTeamStats = async () => {
    try {
      setIsLoading(true);
      const response = await users.getUsers();
      const totalCount = response?.totalCount || 0;
      setTeamStats({ totalCount, users: response?.users || [] });
    } catch (error) {
      console.error('팀 통계 조회 실패:', error);
      setTeamStats({ totalCount: 0, users: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  // 통계 데이터
  const stats = [
    { title: "이번 달 일정", value: "12개", icon: <Clock className="w-6 h-6" />, color: "bg-blue-500" },
    { title: "활성 프로젝트", value: "4개", icon: <Target className="w-6 h-6" />, color: "bg-green-500" },
    { title: "팀 멤버", value: isLoading ? "로딩 중..." : `${teamStats.totalCount}명`, icon: <Users className="w-6 h-6" />, color: "bg-purple-500" },
    { title: "완료된 작업", value: "85%", icon: <BarChart2 className="w-6 h-6" />, color: "bg-orange-500" },
  ];

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">
        안녕하세요! {user?.name || user?.userId} 님 방문해주셔서 감사합니다. 💧
      </h1>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 캘린더 섹션 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">일정 캘린더</h2>
            <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center">
              <Plus className="w-5 h-5 mr-1" />
              일정 추가
            </button>
          </div>
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ko-KR"
          />
        </div>

        {/* 최근 활동 섹션 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 활동</h2>
            <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center">
              전체보기
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                  <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">새로운 프로젝트가 추가되었습니다</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">2시간 전</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
