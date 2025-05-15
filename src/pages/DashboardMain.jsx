import { useEffect } from "react";
import { useMenuStore } from "../store/menuStore";
import useUserStore from "../store/userStore";
import { Clock, Target, Users, BarChart2 } from 'lucide-react';
import StatCard from "../components/common/StatCard";
import WorldMap from "../components/map/WorldMap";
import CountryList from "../components/map/CountryList";
import { useGeoData } from "../hooks/useGeoData";
import { useTeamStats } from "../hooks/useTeamStats";

function DashboardMain() {
  const { fetchMenus } = useMenuStore();
  const { user } = useUserStore();
  const { 
    visitedCountries, 
    position, 
    setPosition, 
    addCountry, 
    deleteCountry 
  } = useGeoData();
  
  const { teamStats, loading: statsLoading } = useTeamStats();

  useEffect(() => {
    document.title = "퐁당 | 대시보드 📊";
    fetchMenus();
  }, [fetchMenus]);

  const handleCountryClick = async (geoItem, coordinates) => {
    // DB에 저장할 데이터 구조
    const countryData = {
      countryName: geoItem.properties.name,
      countryCode: geoItem.id || "",
      longitude: coordinates[0],
      latitude: coordinates[1],
      visitDate: new Date().toISOString().split('T')[0],
      notes: ""
    };
    
    try {
      await addCountry(countryData);
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 통계 데이터
  const stats = [
    { title: "이번 달 일정", value: "12개", icon: <Clock className="w-6 h-6" />, color: "bg-blue-500" },
    { title: "활성 프로젝트", value: "4개", icon: <Target className="w-6 h-6" />, color: "bg-green-500" },
    { title: "팀 멤버", value: statsLoading ? "로딩 중..." : `${teamStats.totalCount}명`, icon: <Users className="w-6 h-6" />, color: "bg-purple-500" },
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
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* 세계 지도 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">여행 지도</h2>
          <WorldMap 
            position={position}
            setPosition={setPosition}
            visitedCountries={visitedCountries}
            onCountryClick={handleCountryClick}
          />
        </div>

        {/* 방문한 나라 목록 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">방문한 나라 목록</h2>
          <CountryList 
            countries={visitedCountries}
            onDeleteCountry={deleteCountry}
          />
        </div>
      </div>
    </div>
  );
}

export { DashboardMain as default };
