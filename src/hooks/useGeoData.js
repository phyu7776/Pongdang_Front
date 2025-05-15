import { useState, useEffect, useCallback } from 'react';
import { geo } from '../api/endpoints';

/**
 * 지리 데이터 관련 커스텀 훅
 * @returns {Object} 지리 데이터 관련 상태 및 함수
 */
export const useGeoData = () => {
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  const fetchVisitedCountries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await geo.getGeoList();
      
      if (!data || !Array.isArray(data)) {
        setError("여행 데이터 형식이 올바르지 않습니다");
        return;
      }
      
      // DB 데이터 형식을 지도 컴포넌트에 맞게 변환
      const formattedData = data.map(country => ({
        uid: country.uid,
        id: country.countryCode,
        name: country.countryName,
        coordinates: [country.longitude, country.latitude],
        date: country.createdAt,
        notes: country.notes
      }));
      
      setVisitedCountries(formattedData);
      setError(null);
    } catch (err) {
      setError("방문한 국가 데이터를 가져오는 중 오류가 발생했습니다");
      console.error("방문한 국가 데이터 가져오기 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 데이터 추가
  const addCountry = useCallback(async (countryData) => {
    try {
      // API 요청 보내기
      const savedData = await geo.createGeoData(countryData);
      
      // API 응답으로 받은 데이터를 상태에 추가
      const newCountry = {
        uid: savedData.uid,
        id: savedData.countryCode,
        name: countryData.countryName,
        coordinates: [countryData.longitude, countryData.latitude],
        date: countryData.visitDate,
        notes: countryData.notes
      };
      
      // 현재 중앙점으로 지도 이동
      setPosition(prev => ({
        ...prev,
        coordinates: [countryData.longitude, countryData.latitude]
      }));
      
      setVisitedCountries(prev => [...prev, newCountry]);
      return newCountry;
    } catch (error) {
      console.error("국가 추가 중 오류 발생:", error);
      throw error;
    }
  }, []);

  // 데이터 삭제
  const deleteCountry = useCallback(async (uid) => {
    try {
      await geo.deleteGeoData(uid);
      setVisitedCountries(prev => prev.filter(country => country.uid !== uid));
      return true;
    } catch (error) {
      console.error("국가 삭제 중 오류 발생:", error);
      throw error;
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchVisitedCountries();
  }, [fetchVisitedCountries]);

  return {
    visitedCountries,
    position,
    setPosition,
    loading,
    error,
    fetchVisitedCountries,
    addCountry,
    deleteCountry
  };
}; 