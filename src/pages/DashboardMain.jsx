import { useEffect, useState, useRef } from "react";
import { useMenuStore } from "../store/menuStore";
import useUserStore from "../store/userStore";
import { users, geo } from "../api/endpoints";
import { Activity, Clock, Plus, ChevronRight, BarChart2, Users, Target, ZoomIn, ZoomOut } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import centroid from "@turf/centroid";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 예시 DB 구조 (실제로는 API로 가져옴)
// const visitedCountriesFromDB = [
//   {
//     id: 1,
//     countryName: "대한민국",
//     countryCode: "KOR",
//     longitude: 127.7669,  // 경도
//     latitude: 35.9078,    // 위도
//     visitDate: "2023-05-15",
//     notes: "서울 여행"
//   },
//   {
//     id: 2,
//     countryName: "일본",
//     countryCode: "JPN",
//     longitude: 139.6503,
//     latitude: 35.6762,
//     visitDate: "2023-07-20",
//     notes: "도쿄 여행"
//   }
// ];

function DashboardMain() {
  const { fetchMenus } = useMenuStore();
  const { user } = useUserStore();
  const [teamStats, setTeamStats] = useState({ totalCount: 0, users: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  useEffect(() => {
    document.title = "퐁당 | 대시보드 📊";
    fetchMenus();
    fetchTeamStats();
    fetchVisitedCountries(); // DB에서 방문한 국가 데이터 가져오기
  }, []);

  // DB에서 여행 데이터 가져오기
  const fetchVisitedCountries = async () => {
    try {
      const data = await geo.getGeoList();
      console.log("불러온 여행 데이터:", data);
      
      if (!data || !Array.isArray(data)) {
        console.error("여행 데이터 형식이 올바르지 않습니다:", data);
        return;
      }
      
      // DB 데이터 형식을 지도 컴포넌트에 맞게 변환
      const formattedData = data.map(country => ({
        uid : country.uid,
        id: country.countryCode,
        name: country.countryName,
        coordinates: [country.longitude, country.latitude],
        date: country.createdAt,
        notes: country.notes
      }));
      
      setVisitedCountries(formattedData);
    } catch (error) {
      console.error("방문한 국가 데이터 가져오기 실패:", error);
    }
  };

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

  const handleCountryClick = async (geoItem) => {
    console.log("Clicked country:", geoItem);
    
    // 국가 중심점 계산
    const center = centroid(geoItem);
    const coordinates = center.geometry.coordinates;
    console.log("Country centroid:", coordinates);
    
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
      // API 요청 보내기
      const savedData = await geo.createGeoData(countryData);
      
      // API 응답으로 받은 데이터를 상태에 추가
      const newCountry = {
        id: savedData.id || Date.now(),
        name: countryData.countryName,
        coordinates: coordinates,
        date: countryData.visitDate,
        notes: countryData.notes
      };
      
      // 현재 중앙점으로 지도 이동
      setPosition(prev => ({
        ...prev,
        coordinates: coordinates
      }));
      
      setVisitedCountries([...visitedCountries, newCountry]);
    } catch (error) {
      console.error("API 요청 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 데이터 삭제 API 호출 함수
  const deleteVisitedCountry = async (uid) => {
    try {
      // API 호출
      await geo.deleteGeoData(uid);
      console.log("여행 데이터 삭제 성공");
      
      // 상태에서 제거
      setVisitedCountries(visitedCountries.filter(country => country.uid !== uid));
    } catch (error) {
      console.error("API 요청 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 4) }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 0.5) return;
    setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 0.5) }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
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

      {/* 세계 지도 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">여행 지도</h2>
          <div style={{ width: "100%", height: "500px", backgroundColor: "#f5f5f5", position: "relative" }}>
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 120,
                center: [0, 0]
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
                minZoom={1}
                maxZoom={4}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleCountryClick(geo)}
                        style={{
                          default: {
                            fill: "#A8A8B3",
                            stroke: "#FFFFFF",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: "#F53",
                            outline: "none",
                          },
                          pressed: {
                            fill: "#E42",
                            outline: "none",
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {visitedCountries.length > 0 && visitedCountries.map((country, index) => (
                  country.coordinates && country.coordinates.length === 2 ? (
                    <Marker key={index} coordinates={country.coordinates}>
                      <circle r={5} fill="#F53" />
                    </Marker>
                  ) : null
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>

        {/* 방문한 나라 목록 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">방문한 나라 목록</h2>
          <div className="space-y-4 max-h-[450px] overflow-y-auto">
            {visitedCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{country.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">방문일: {country.date}</p>
                  {country.notes && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{country.notes}</p>
                  )}
                </div>
                <button 
                  onClick={() => deleteVisitedCountry(country.uid)}
                  className="text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            ))}
            {visitedCountries.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                아직 방문한 나라가 없습니다. 지도를 클릭하여 방문한 나라를 추가해보세요!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
