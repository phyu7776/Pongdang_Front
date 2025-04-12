import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default NotFound; 