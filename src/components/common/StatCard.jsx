import PropTypes from 'prop-types';
import { memo } from 'react';

/**
 * 통계 카드 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 카드 제목
 * @param {string} props.value - 카드 값
 * @param {React.ReactNode} props.icon - 카드 아이콘
 * @param {string} props.color - 아이콘 배경색 클래스
 */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired
};

export default memo(StatCard); 