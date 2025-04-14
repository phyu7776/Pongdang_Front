import { useState, useEffect } from 'react';
import { Settings, User, Lock, Mail, Phone } from 'lucide-react';
import useUserStore from '../store/userStore';
import { users } from '../api/endpoints';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';

function UserSettings() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    nickname: '',
    birthday: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        name: user.name || '',
        nickname: user.nickname || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        name: userInfo.name,
        nickname: userInfo.nickname,
        birthday: userInfo.birthday
      };
      await users.updateUser(updatedUser);
      showSuccessToast('사용자 정보가 수정되었습니다');
    } catch (error) {
      console.error('Error updating user info:', error);
      showErrorToast('사용자 정보 수정 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      setPasswordError(true);
      showErrorToast('새 비밀번호가 일치하지 않습니다');
      return;
    }
    setPasswordError(false);
    setLoading(true);
    try {
      await users.changePassword({
        currentPassword: userInfo.currentPassword,
        newPassword: userInfo.newPassword
      });
      showSuccessToast('비밀번호가 변경되었습니다');
      setUserInfo(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      showErrorToast('비밀번호 변경 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          개인 설정
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* 기본 정보 수정 폼 */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            기본 정보
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                생년월일
              </label>
              <input
                type="date"
                name="birthday"
                value={userInfo.birthday}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : '기본 정보 저장'}
            </button>
          </div>
        </form>

        {/* 비밀번호 변경 폼 */}
        <form onSubmit={handlePasswordChange} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            비밀번호 변경
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                name="currentPassword"
                value={userInfo.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                name="newPassword"
                value={userInfo.newPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                  passwordError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userInfo.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                  passwordError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
      <ToasterConfig />
    </div>
  );
}

export default UserSettings; 