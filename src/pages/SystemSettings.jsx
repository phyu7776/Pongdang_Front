import { useEffect, useState } from 'react';
import { Settings, Shield, UserCog, Users as UsersIcon } from 'lucide-react';
import axiosUtil from '../utils/axiosUtil';

function SystemSettings() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axiosUtil.get('/config/get/systemConfig/role');
      setRoles(response.data);
      setError(null);
    } catch (err) {
      setError('역할 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleConfig = (roleValue) => {
    const role = roleValue?.toLowerCase() || 'user';
    switch (role) {
      case 'admin':
        return {
          icon: <Shield className="w-5 h-5" />,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/30',
          borderColor: 'border-purple-200 dark:border-purple-700'
        };
      case 'supervisor':
        return {
          icon: <UserCog className="w-5 h-5" />,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-700'
        };
      default:
        return {
          icon: <UsersIcon className="w-5 h-5" />,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/30',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500">{error}</p>
      <button
        onClick={fetchRoles}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          시스템 설정
        </h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">역할 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const config = getRoleConfig(role.configValue);
            return (
              <div
                key={role.configValue}
                className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={config.color}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${config.color}`}>
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.description || `${role.name} 권한`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SystemSettings; 