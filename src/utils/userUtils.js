import { User, UserX, Clock } from 'lucide-react';

export const getStateLabel = (state) => {
  switch (state) {
    case 'U':
      return { 
        label: '사용', 
        className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        icon: User
      };
    case 'D':
      return { 
        label: '삭제', 
        className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
        icon: UserX
      };
    case 'W':
      return { 
        label: '대기', 
        className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        icon: Clock
      };
    default:
      return { 
        label: '알 수 없음', 
        className: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
        icon: User
      };
  }
};

export const formatBirthday = (birthday) => {
  if (!birthday) return '생일 정보 없음';
  return new Date(birthday).toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}; 