import { Shield, UserCog, Users as UsersIcon } from 'lucide-react';

export const getRoleConfig = (roleValue) => {
  const role = roleValue?.toLowerCase() || 'user';
  switch (role) {
    case 'admin':
      return {
        icon: Shield,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
        borderColor: 'border-purple-200 dark:border-purple-700'
      };
    case 'supervisor':
      return {
        icon: UserCog,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        borderColor: 'border-blue-200 dark:border-blue-700'
      };
    default:
      return {
        icon: UsersIcon,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        borderColor: 'border-gray-200 dark:border-gray-700'
      };
  }
};

export const getAvailableRoles = (currentUserRole, roles) => {
  const userRole = currentUserRole?.toLowerCase() || 'user';
  
  if (userRole === 'admin') {
    return roles; // 모든 권한 부여 가능
  } else if (userRole === 'supervisor') {
    return roles.filter(role => role.value.toLowerCase() !== 'admin'); // admin 권한 제외하고 부여 가능
  } else {
    return roles.filter(role => role.value.toLowerCase() === 'user'); // user 권한만 부여 가능
  }
};

export const getRoleDescription = (roleValue) => {
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