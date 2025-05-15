import PropTypes from 'prop-types';
import { memo } from 'react';

/**
 * 방문한 국가 목록 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Array} props.countries - 방문한 국가 목록
 * @param {function} props.onDeleteCountry - 국가 삭제 핸들러
 */
function CountryList({ countries, onDeleteCountry }) {
  return (
    <div className="space-y-4 max-h-[450px] overflow-y-auto">
      {countries.map((country, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
          <div>
            <p className="text-gray-900 dark:text-white font-medium">{country.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">방문일: {country.date}</p>
            {country.notes && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{country.notes}</p>
            )}
          </div>
          <button 
            onClick={() => onDeleteCountry(country.uid)}
            className="text-red-500 hover:text-red-600"
            aria-label={`${country.name} 국가 삭제`}
          >
            삭제
          </button>
        </div>
      ))}
      {countries.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          아직 방문한 나라가 없습니다. 지도를 클릭하여 방문한 나라를 추가해보세요!
        </p>
      )}
    </div>
  );
}

CountryList.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
      name: PropTypes.string.isRequired,
      date: PropTypes.string,
      notes: PropTypes.string,
    })
  ).isRequired,
  onDeleteCountry: PropTypes.func.isRequired
};

export default memo(CountryList); 