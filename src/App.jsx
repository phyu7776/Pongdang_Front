import { AppRoutes } from './routes/index';
import { useConfig } from './hooks/useConfig';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const { loading } = useConfig();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate('/login');
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">초기 설정 불러오는 중...</div>;
  }

  return <AppRoutes />;
}

export default App;
