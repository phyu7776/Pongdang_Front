import useUserStore from "../store/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardMain() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "퐁당 | 대시보드 📊";
  }, []);

  useEffect(() => {
  // ✅ navigate 한 번만 실행되게 조건 강화
  if (!user || !user.token) {
    // setTimeout을 이용해 call stack 정리 후 실행 (무한 루프 방지용 트릭)
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  }}, [user?.token]); // ✅ 꼭 token만 의존성에 넣기

  return (
    <div className="p-6 text-white">
    <h1>안녕하세요, {user?.name || user?.userId}님!</h1>
  </div>
  );
}

export default DashboardMain;
