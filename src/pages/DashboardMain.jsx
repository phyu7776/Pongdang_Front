import { useEffect, useState } from "react";
import { useMenuStore } from "../store/menuStore";
import Calendar from "react-calendar";
import '../styles/Calendar.css'; // ✅ 커스텀 스타일 import!

function DashboardMain() {
  const { fetchMenus } = useMenuStore();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    document.title = "퐁당 | 대시보드 📊";
    fetchMenus();
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
        퐁당 일정!!! 💧
      </h1>

      <div className="w-full">
        <Calendar
          onChange={handleDateChange}
          value={date}
          locale="ko-KR"
        />
      </div>
    </div>
  );
}

export default DashboardMain;
