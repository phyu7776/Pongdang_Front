import { AppRoutes } from './routes/index';
import { useConfig } from './hooks/useConfig';

function App() {
  const { loading } = useConfig();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">초기 설정 불러오는 중...</div>;
  }

  return <AppRoutes />;
}

export default App;
