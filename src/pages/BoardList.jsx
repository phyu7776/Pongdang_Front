import React, { useEffect, useState, useRef, useCallback } from 'react';
import { boards } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

const BoardList = () => {
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef();
  const navigate = useNavigate();

  const lastBoardElementRef = useCallback(node => {
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
    const fetchBoardList = async () => {
      setLoading(true);
      try {
        const data = await boards.getBoardList(page);
        setBoardList(prev => {
          const newBoards = [...prev];
          data.forEach(board => {
            if (!newBoards.some(b => b.uid === board.uid)) {
              newBoards.push(board);
            }
          });
          return newBoards;
        });
        setHasMore(data.length > 0);
      } catch (error) {
        console.error('Error fetching board list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardList();
  }, [page]);

  const handleCreateBoard = () => {
    navigate('/board/create');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">게시판</h2>
        </div>
        <button
          onClick={handleCreateBoard}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          글쓰기
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider first:rounded-tl-xl">구분</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider last:rounded-tr-xl">추천</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
              {boardList.map((board, index) => (
                <tr 
                  key={`${board.uid}-${index}`} 
                  ref={index === boardList.length - 1 ? lastBoardElementRef : null}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                  onClick={() => navigate(`/board/${board.uid}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm first:rounded-bl-xl last:rounded-br-xl">
                    {board.notice ? (
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                        공지
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {board.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {board.creatorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {board.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 last:rounded-br-xl">
                    {board.good}
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

      {!hasMore && boardList.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          마지막 게시글입니다.
        </div>
      )}
    </div>
  );
};

export default BoardList; 