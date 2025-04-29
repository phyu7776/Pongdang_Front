import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boards } from '../api/endpoints';
import Modal from '../components/common/Modal';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await boards.getBoardDetail(id);
        setBoard(response);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        showModal('오류', '게시글을 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [id]);

  const showModal = (title, message, type) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    showModal('게시글 삭제', '정말로 이 게시글을 삭제하시겠습니까?', 'confirm');
  };

  const handleConfirm = async () => {
    if (modalType !== 'confirm') {
      setModalOpen(false);
      return;
    }

    try {
      await boards.deleteBoard(id);
      navigate('/board');
    } catch (error) {
      console.error('Error deleting board:', error);
      showModal('오류', '게시글 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        onConfirm={handleConfirm}
        confirmText={modalType === 'confirm' ? '확인' : '닫기'}
        showCancel={modalType === 'confirm'}
      >
        {modalMessage}
      </Modal>

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{board.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/board/${id}/edit`, { state: { board } })}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>작성자: {board.creatorName}</span>
            <span className="mx-2">|</span>
            <span>작성일: {board.createdAt}</span>
            <span className="mx-2">|</span>
            <span>좋아요: {board.good}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 text-gray-800 dark:text-gray-200">
            <div dangerouslySetInnerHTML={{ __html: board.content }} />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => navigate('/board')}
          className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default BoardDetail; 