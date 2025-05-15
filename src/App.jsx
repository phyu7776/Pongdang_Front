import { AppRoutes } from './routes/index';
import { useConfig } from './hooks/useConfig';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from './store/userStore';
import useThemeStore from './store/themeStore';

function App() {
  const { loading } = useConfig();
  const navigate = useNavigate();
  const completeLogout = useUserStore(state => state.completeLogout);
  const initTheme = useThemeStore(state => state.initTheme);

  // 테마 초기화
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const handleLogout = () => {
      // 로그인 페이지로 이동 후 로그아웃 완료 플래그 설정
      navigate('/login', { replace: true });
      // 로그아웃 프로세스 완료 표시 (모든 리다이렉트 후)
      setTimeout(() => {
        completeLogout();
      }, 100);
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, [navigate, completeLogout]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">초기 설정 불러오는 중...</div>;
  }

  return <AppRoutes />;
}

export default App;
