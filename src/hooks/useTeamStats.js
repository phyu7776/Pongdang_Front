import { useState, useEffect, useCallback } from 'react';
import { users } from '../api/endpoints';

/**
 * 팀 통계 데이터 관련 커스텀 훅
 * @returns {Object} 팀 통계 관련 상태 및 함수
 */
export const useTeamStats = () => {
  const [teamStats, setTeamStats] = useState({ totalCount: 0, users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await users.getUsers();
      const totalCount = response?.totalCount || 0;
      setTeamStats({ totalCount, users: response?.users || [] });
      setError(null);
    } catch (error) {
      console.error('팀 통계 조회 실패:', error);
      setTeamStats({ totalCount: 0, users: [] });
      setError('팀 통계를 가져오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTeamStats();
  }, [fetchTeamStats]);

  return {
    teamStats,
    loading,
    error,
    fetchTeamStats
  };
}; 