import { useEffect, useState, forwardRef } from 'react';
import { 
  Users, Search, Edit2, Trash2, UserCheck, Check, UserX, Clock, User, Key, ChevronDown,
  Shield, UserCog, Users as UsersIcon, XCircle
} from 'lucide-react';
import Tippy from '@tippyjs/react';
import toast, { Toaster } from 'react-hot-toast';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/shift-away.css';
import axiosUtil from '../utils/axiosUtil';
import userStore from '../store/userStore';

// 커스텀 스타일 추가
const customTippyStyles = {
  '.tippy-content': {
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent'
  },
  '.tippy-box': {
    border: 'none',
    backgroundColor: 'transparent'
  }
};

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [roles, setRoles] = useState([]);
  const currentUserRole = userStore.getState().user?.role?.toLowerCase() || 'user';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        axiosUtil.get('/admin/getUsers'),
        axiosUtil.get('/config/get/systemConfig/role')
      ]);

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data.map(role => ({
        value: role.configValue,
        label: role.name
      })));

      // 초기 역할 설정
      const initialRoles = {};
      usersResponse.data.forEach(user => {
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
      const response = await axiosUtil.get('/admin/getUsers');
      setUsers(response.data);
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
    const waitingUsers = users.filter(user => user.state === 'W').map(user => user.uid);
    if (selectedUsers.length === waitingUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(waitingUsers);
    }
  };

  const handleRoleChange = (uid, role) => {
    setUserRoles(prev => ({
      ...prev,
      [uid]: role
    }));
  };

  const approveUsers = async (uids) => {
    try {
      const approveList = uids.map(uid => {
        const user = users.find(u => u.uid === uid);
        if (!user) return null;
        return {
          uid: user.uid,
          userId: user.userId,
          role: userRoles[uid] || 'USER'
        };
      }).filter(Boolean);

      await axiosUtil.put('/admin/approve', approveList);
      fetchUsers();
      setSelectedUsers([]);
      toast.custom((t) => (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <UserCheck className="w-5 h-5" />
            <p className="text-base font-medium">선택한 사용자들의 가입이 승인되었습니다</p>
          </div>
        </div>
      ), {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: 'transparent',
          maxWidth: 'none',
          padding: 0
        }
      });
    } catch (err) {
      console.error('Error approving users:', err);
      toast.custom((t) => (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <XCircle className="w-5 h-5" />
            <p className="text-base font-medium">사용자 승인 중 오류가 발생했습니다</p>
          </div>
        </div>
      ), {
        duration: 3000,
        style: {
          background: 'transparent',
          maxWidth: 'none',
          padding: 0
        }
      });
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'U':
        return { 
          label: '사용', 
          className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
          icon: <User className="w-4 h-4 mr-1" />
        };
      case 'D':
        return { 
          label: '삭제', 
          className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
          icon: <UserX className="w-4 h-4 mr-1" />
        };
      case 'W':
        return { 
          label: '대기', 
          className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
          icon: <Clock className="w-4 h-4 mr-1" />
        };
      default:
        return { 
          label: '알 수 없음', 
          className: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
          icon: <User className="w-4 h-4 mr-1" />
        };
    }
  };

  const getAvailableRoles = () => {
    // 현재 사용자의 role이 admin인 경우
    if (currentUserRole === 'admin') {
      return roles; // 모든 권한 부여 가능
    }
    // 현재 사용자의 role이 supervisor인 경우
    else if (currentUserRole === 'supervisor') {
      return roles.filter(role => role.value.toLowerCase() !== 'admin'); // admin 권한 제외하고 부여 가능
    }
    // 그 외의 경우
    else {
      return roles.filter(role => role.value.toLowerCase() === 'user'); // user 권한만 부여 가능
    }
  };

  const getRoleConfig = (roleValue) => {
    const role = roleValue?.toLowerCase() || 'user';
    switch (role) {
      case 'admin':
        return {
          icon: <Shield className="w-4 h-4" />,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900',
          borderColor: 'border-purple-200 dark:border-purple-700'
        };
      case 'supervisor':
        return {
          icon: <UserCog className="w-4 h-4" />,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          borderColor: 'border-blue-200 dark:border-blue-700'
        };
      default:
        return {
          icon: <UsersIcon className="w-4 h-4" />,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  const RoleDropdown = ({ value, onChange, roles, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedNewRole, setSelectedNewRole] = useState(null);
    
    const handleRoleSelect = (role) => {
      if (role.value !== value) {
        setSelectedNewRole(role);
        setShowConfirmModal(true);
      }
      setIsOpen(false);
    };

    const getRoleDescription = (roleValue) => {
      switch (roleValue.toLowerCase()) {
        case 'admin':
          return '모든 시스템 설정 및 사용자 관리 권한';
        case 'supervisor':
          return '일반 사용자 관리 및 제한된 설정 권한';
        case 'user':
          return '기본 사용자 권한';
        default:
          return '권한 설명 없음';
      }
    };

    const TippyContent = () => (
      <div className="py-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg min-w-[200px]">
        {roles.map((role) => {
          const config = getRoleConfig(role.value);
          return (
            <button
              key={role.value}
              onClick={() => handleRoleSelect(role)}
              className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700
                ${role.value === value ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
              role="menuitem"
              aria-selected={role.value === value}
            >
              <div className="flex items-center space-x-2">
                <span className={`flex items-center justify-center ${config.color}`}>
                  {config.icon}
                </span>
                <span className="font-medium">{role.label}</span>
              </div>
              {role.value === value && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    );

    return (
      <>
        <div className="relative">
          <Tippy
            content={<TippyContent />}
            interactive={true}
            visible={isOpen}
            onClickOutside={() => setIsOpen(false)}
            placement="bottom-start"
            theme="material"
            animation="shift-away"
            arrow={false}
            maxWidth="none"
            appendTo={() => document.body}
          >
            <button
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}
                ${getRoleConfig(value).bgColor}`}
              aria-haspopup="true"
              aria-expanded={isOpen}
              disabled={disabled}
            >
              <span className={`flex items-center ${getRoleConfig(value).color}`}>
                {getRoleConfig(value).icon}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">{roles.find(role => role.value === value)?.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
              <span className="sr-only">{getRoleDescription(value)}</span>
            </button>
          </Tippy>
          {isOpen && (
            <div className="fixed inset-0 z-10" aria-hidden="true" onClick={() => setIsOpen(false)} />
          )}
        </div>
        
        {/* 확인 모달 */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowConfirmModal(false)} />
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative z-10">
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">역할 변경 확인</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  사용자의 역할을 <span className="font-medium text-blue-600 dark:text-blue-400">{selectedNewRole?.label}</span>(으)로 변경하시겠습니까?
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    onChange(selectedNewRole.value);
                    setShowConfirmModal(false);
                    toast.custom((t) => (
                      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
                        <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3">
                          <Check className="w-5 h-5" />
                          <p className="text-base font-medium">역할이 변경되었습니다</p>
                        </div>
                      </div>
                    ), {
                      duration: 2000,
                      position: 'bottom-center'
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
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

  const waitingUsersCount = users.filter(user => user.state === 'W').length;

  return (
    <div className="p-8 bg-white dark:bg-zinc-900 min-h-screen">
      <Toaster
        position="bottom-center"
        containerClassName="!transform-none"
        toastOptions={{
          className: '!transform-none',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            maxWidth: 'none',
            width: 'auto'
          }
        }}
      />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            사용자 관리
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 가입 승인 버튼 */}
          {waitingUsersCount > 0 && (
            <button
              onClick={() => approveUsers(selectedUsers)}
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
          
          {/* 검색 바 */}
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

      {/* 사용자 목록 테이블 */}
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
            {users.map((user) => (
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
                    roles={getAvailableRoles()}
                    disabled={user.state === 'D'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${getStateLabel(user.state).className}`}>
                      {getStateLabel(user.state).icon}
                      {getStateLabel(user.state).label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.birthday ? new Date(user.birthday).toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : '생일 정보 없음'}
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
                        onClick={() => approveUsers([user.uid])}
                        className="text-green-500 hover:text-green-600 mr-3"
                      >
                        <Check className="w-5 h-5" />
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
                    <button className="text-blue-500 hover:text-blue-600 mr-3">
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
                    <button className="text-green-500 hover:text-green-600 mr-3">
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
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Tippy>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUser; 