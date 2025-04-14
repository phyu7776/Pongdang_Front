import { useEffect, useState } from 'react';
import { 
  Users, Search, Edit2, Trash2, UserCheck, Key, XCircle, X
} from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/shift-away.css';
import userStore from '../store/userStore';
import { getStateLabel, formatBirthday } from '../utils/userUtils';
import { getAvailableRoles } from '../utils/roleUtils';
import RoleDropdown from '../components/user/RoleDropdown';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';
import { users, config } from '../api/endpoints';
import { Dialog } from '@headlessui/react';

function ManageUser() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [roles, setRoles] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    nickname: '',
    birthday: ''
  });
  const currentUserRole = userStore.getState().user?.role?.toLowerCase() || 'user';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        users.getUsers(),
        config.getSystemConfig('role')
      ]);

      setUserList(usersResponse);
      setRoles(rolesResponse.map(role => ({
        value: role.configValue,
        label: role.name
      })));

      const initialRoles = {};
      usersResponse.forEach(user => {
        initialRoles[user.uid] = user.role || 'USER';
      });
      setUserRoles(initialRoles);
      setError(null);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await users.getUsers();
      setUserList(response);
      setError(null);
    } catch (err) {
      setError('사용자 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (uid) => {
    setSelectedUsers(prev => {
      if (prev.includes(uid)) {
        return prev.filter(id => id !== uid);
      }
      return [...prev, uid];
    });
  };

  const handleSelectAll = () => {
    const waitingUsers = userList.filter(user => user.state === 'W').map(user => user.uid);
    if (selectedUsers.length === waitingUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(waitingUsers);
    }
  };

  const handleRoleChange = async (uid, role) => {
    const user = userList.find(u => u.uid === uid);
    if (!user) return;

    try {
      const updatedUser = { ...user, role };
      await users.updateUser(updatedUser);
      setUserRoles(prev => ({
        ...prev,
        [uid]: role
      }));
      showSuccessToast('역할이 성공적으로 변경되었습니다');
    } catch (err) {
      console.error('Error updating user role:', err);
      showErrorToast('역할 변경 중 오류가 발생했습니다');
    }
  };

  const handleApproveUsers = async (uids) => {
    try {
      const approveList = uids.map(uid => {
        const user = userList.find(u => u.uid === uid);
        if (!user) return null;
        return {
          uid: user.uid,
          userId: user.userId,
          role: userRoles[uid] || 'USER'
        };
      }).filter(Boolean);

      await users.approveUsers(approveList);
      fetchUsers();
      setSelectedUsers([]);
      showSuccessToast('선택한 사용자들의 가입이 승인되었습니다');
    } catch (err) {
      console.error('Error approving users:', err);
      showErrorToast('사용자 승인 중 오류가 발생했습니다');
    }
  };

  const handlePasswordReset = async (user) => {
    try {
      const updatedUser = { ...user, password: '1111' };
      await users.updateUser(updatedUser);
      showSuccessToast('비밀번호가 초기화되었습니다');
    } catch (err) {
      console.error('Error resetting password:', err);
      showErrorToast('비밀번호 초기화 중 오류가 발생했습니다');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      nickname: user.nickname,
      birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...editingUser,
        ...editForm
      };
      await users.updateUser(updatedUser);
      setIsEditModalOpen(false);
      fetchUsers();
      showSuccessToast('사용자 정보가 수정되었습니다');
    } catch (err) {
      console.error('Error updating user:', err);
      showErrorToast('사용자 정보 수정 중 오류가 발생했습니다');
    }
  };

  const handleDeleteUser = async (uid) => {
    try {
      await users.deleteUser([{ uid: uid }]);
      fetchUsers();
      showSuccessToast('사용자가 삭제되었습니다');
    } catch (err) {
      console.error('Error deleting user:', err);
      showErrorToast('사용자 삭제 중 오류가 발생했습니다');
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
        onClick={fetchUsers}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );

  const waitingUsersCount = userList.filter(user => user.state === 'W').length;

  return (
    <div className="p-8 bg-white dark:bg-zinc-900 min-h-screen">
      <ToasterConfig />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            사용자 관리
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {waitingUsersCount > 0 && (
            <button
              onClick={() => handleApproveUsers(selectedUsers)}
              disabled={selectedUsers.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                selectedUsers.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              가입 승인 ({selectedUsers.length})
            </button>
          )}
          
          <div className="relative">
            <input
              type="text"
              placeholder="사용자 검색..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              {waitingUsersCount > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === waitingUsersCount && waitingUsersCount > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-zinc-800"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                사용자 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                역할
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                생년월일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
            {userList.map((user) => {
              const stateLabel = getStateLabel(user.state);
              const StateIcon = stateLabel.icon;
              
              return (
                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                  {waitingUsersCount > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.state === 'W' && (
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.uid)}
                          onChange={() => handleUserSelect(user.uid)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-zinc-800"
                        />
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.nickname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleDropdown
                      value={userRoles[user.uid] || user.role || 'USER'}
                      onChange={(value) => handleRoleChange(user.uid, value)}
                      roles={getAvailableRoles(currentUserRole, roles)}
                      disabled={user.state === 'D'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${stateLabel.className}`}>
                        <StateIcon className="w-4 h-4 mr-1" />
                        {stateLabel.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatBirthday(user.birthday)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.state === 'W' && (
                      <Tippy 
                        content={
                          <div className="flex items-center space-x-1">
                            <UserCheck className="w-4 h-4" />
                            <span>사용자 승인</span>
                          </div>
                        }
                        theme="material"
                        animation="shift-away"
                        arrow={false}
                        placement="left"
                        delay={[0, 0]}
                      >
                        <button 
                          onClick={() => handleApproveUsers([user.uid])}
                          className="text-green-500 hover:text-green-600 mr-3"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                      </Tippy>
                    )}
                    <Tippy 
                      content={
                        <div className="flex items-center space-x-1 px-2 py-1">
                          <Key className="w-4 h-4" />
                          <span>비밀번호 초기화</span>
                        </div>
                      }
                      theme="material"
                      animation="shift-away"
                      arrow={false}
                      placement="left"
                      delay={[0, 0]}
                    >
                      <button 
                        onClick={() => handlePasswordReset(user)}
                        className="text-blue-500 hover:text-blue-600 mr-3"
                      >
                        <Key className="w-5 h-5" />
                      </button>
                    </Tippy>
                    <Tippy 
                      content={
                        <div className="flex items-center space-x-1 px-2 py-1">
                          <Edit2 className="w-4 h-4" />
                          <span>사용자 정보 수정</span>
                        </div>
                      }
                      theme="material"
                      animation="shift-away"
                      arrow={false}
                      placement="left"
                      delay={[0, 0]}
                    >
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-green-500 hover:text-green-600 mr-3"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </Tippy>
                    <Tippy 
                      content={
                        <div className="flex items-center space-x-1">
                          <Trash2 className="w-4 h-4" />
                          <span>사용자 삭제</span>
                        </div>
                      }
                      theme="material"
                      animation="shift-away"
                      arrow={false}
                      placement="left"
                      delay={[0, 0]}
                    >
                      <button 
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </Tippy>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white dark:bg-zinc-800 p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                사용자 정보 수정
              </Dialog.Title>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  생년월일
                </label>
                <input
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => setEditForm(prev => ({ ...prev, birthday: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  저장
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ManageUser; 