import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessons } from '../api/endpoints';
import Modal from '../components/common/Modal';
import useUserStore from '../store/userStore';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await lessons.getLessonDetail(id);
        setLesson(response);
      } catch (error) {
        console.error('강습 조회 실패:', error);
        showModal('오류', '강습 정보를 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [id]);

  const showModal = (title, message, type) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    showModal('강습 삭제', '정말로 이 강습을 삭제하시겠습니까?', 'confirm');
  };

  const handleConfirm = async () => {
    if (modalType !== 'confirm') {
      setModalOpen(false);
      return;
    }

    try {
      await lessons.deleteLesson(id);
      navigate('/lesson');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      showModal('오류', '강습 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleReserve = async () => {
    if (!user) {
      showModal('로그인 필요', '강습 예약을 위해서는 로그인이 필요합니다.', 'error');
      return;
    }

    if (lesson.currentCount >= lesson.maxCount) {
      showModal('예약 불가', '이미 정원이 마감되었습니다.', 'error');
      return;
    }

    try {
      await lessons.reserveLesson(id, user.uid);
      showSuccessToast('강습 예약이 완료되었습니다.');
      // 강습 정보 새로고침
      const response = await lessons.getLessonDetail(id);
      setLesson(response);
    } catch (error) {
      console.error('Error reserving lesson:', error);
      showModal('오류', '강습 예약 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleCancel = async () => {
    if (!user) {
      showModal('로그인 필요', '예약 취소를 위해서는 로그인이 필요합니다.', 'error');
      return;
    }

    try {
      await lessons.cancelReservation(id, user.uid);
      showSuccessToast('강습 예약이 취소되었습니다.');
      // 강습 정보 새로고침
      const response = await lessons.getLessonDetail(id);
      setLesson(response);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      showModal('오류', '예약 취소 중 오류가 발생했습니다.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">강습을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const isReserved = lesson.reservations?.some(r => r.userId === user?.uid);

  return (
    <div className="p-6">
      <ToasterConfig />
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
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{lesson.name}</h3>
          <div className="flex space-x-2">
            {user?.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => navigate(`/lesson-reservation/${id}/edit`, { state: { lesson } })}
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
              </>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>강사: {lesson.instructorName}</span>
            <span className="mx-2">|</span>
            <span>날짜: {lesson.date}</span>
            <span className="mx-2">|</span>
            <span>시간: {lesson.time}</span>
            <span className="mx-2">|</span>
            <span>정원: {lesson.currentCount}/{lesson.maxCount}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 text-gray-800 dark:text-gray-200">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>

          {user && (
            <div className="mt-6 flex justify-end">
              {isReserved ? (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  예약 취소
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={lesson.currentCount >= lesson.maxCount}
                  className={`px-4 py-2 rounded transition-colors ${
                    lesson.currentCount >= lesson.maxCount
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {lesson.currentCount >= lesson.maxCount ? '마감' : '예약하기'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => navigate('/lesson-reservation')}
          className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default LessonDetail; 