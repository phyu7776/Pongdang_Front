import React, { useEffect, useState, useRef, useCallback } from 'react';
import { lessons } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const LessonList = () => {
  const [lessonList, setLessonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef();
  const navigate = useNavigate();

  const lastLessonElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchLessonList = async () => {
      setLoading(true);
      try {
        const data = await lessons.getLessonList(page);
        setLessonList(prev => {
          const newLessons = [...prev];
          data.forEach(lesson => {
            if (!newLessons.some(l => l.uid === lesson.uid)) {
              newLessons.push(lesson);
            }
          });
          return newLessons;
        });
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('Error fetching lesson list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonList();
  }, [page]);

  const handleCreateLesson = () => {
    navigate('/lesson-reservation/create');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">강습 예약</h2>
        </div>
        <button
          onClick={handleCreateLesson}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          강습 등록
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider first:rounded-tl-xl">강습명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">강사</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">정원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider last:rounded-tr-xl">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
              {lessonList.map((lesson, index) => (
                <tr 
                  key={`${lesson.uid}-${index}`} 
                  ref={index === lessonList.length - 1 ? lastLessonElementRef : null}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                  onClick={() => navigate(`/lesson-reservation/${lesson.uid}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {lesson.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lesson.instructorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lesson.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lesson.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lesson.currentCount}/{lesson.maxCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm last:rounded-br-xl">
                    {lesson.currentCount >= lesson.maxCount ? (
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                        마감
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
                        예약가능
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}

      {!hasMore && lessonList.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          마지막 강습입니다.
        </div>
      )}
    </div>
  );
};

export default LessonList; 