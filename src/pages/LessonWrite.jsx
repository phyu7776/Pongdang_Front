import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { lessons } from '../api/endpoints';
import { Calendar } from 'lucide-react';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';
import DOMPurify from 'dompurify';
import sanitizeHtml from 'sanitize-html';
import QuillEditor from '../components/editor/QuillEditor';

const LessonWrite = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxCount, setMaxCount] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isEdit && location.state?.lesson) {
      const lesson = location.state.lesson;
      setTitle(lesson.name);
      setContent(lesson.content);
      setInstructorName(lesson.instructorName);
      setDate(lesson.date);
      setTime(lesson.time);
      setMaxCount(lesson.maxCount);
    }
  }, [isEdit, location.state]);

  useEffect(() => {
    // 다크모드 감지
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // 초기 체크
    checkDarkMode();

    // 다크모드 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 에디터 스타일 동적 적용
    const style = document.createElement('style');
    style.textContent = `
      .ql-toolbar {
        ${isDarkMode ? `
          background-color: #111827 !important;
          border-color: #374151 !important;
        ` : `
          background-color: #f9fafb !important;
          border-color: #e5e7eb !important;
        `}
      }
      .ql-container {
        ${isDarkMode ? `
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          color: #f3f4f6 !important;
        ` : `
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          color: #1f2937 !important;
        `}
      }
      .ql-editor {
        min-height: 500px !important;
      }
      .ql-snow .ql-picker {
        ${isDarkMode ? `
          color: #f3f4f6 !important;
        ` : `
          color: #1f2937 !important;
        `}
      }
      .ql-snow .ql-picker-options {
        ${isDarkMode ? `
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          color: #f3f4f6 !important;
        ` : `
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          color: #1f2937 !important;
        `}
      }
      .ql-snow .ql-picker-item:hover {
        ${isDarkMode ? `
          color: #f3f4f6 !important;
          background-color: #374151 !important;
        ` : `
          color: #1f2937 !important;
          background-color: #e5e7eb !important;
        `}
      }
      .ql-snow .ql-stroke {
        ${isDarkMode ? `
          stroke: #f3f4f6 !important;
        ` : `
          stroke: #1f2937 !important;
        `}
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!title.trim()) {
        showErrorToast('제목을 입력해주세요.');
        return;
      }
      
      if (!content.trim()) {
        showErrorToast('내용을 입력해주세요.');
        return;
      }

      if (!instructorName.trim()) {
        showErrorToast('강사명을 입력해주세요.');
        return;
      }

      if (!date.trim()) {
        showErrorToast('날짜를 입력해주세요.');
        return;
      }

      if (!time.trim()) {
        showErrorToast('시간을 입력해주세요.');
        return;
      }

      if (maxCount < 1) {
        showErrorToast('정원은 1명 이상이어야 합니다.');
        return;
      }

      if (!window.confirm(isEdit ? '강습을 수정하시겠습니까?' : '강습을 등록하시겠습니까?')) {
        return;
      }

      // XSS 방지를 위한 HTML sanitize
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
        allowedAttributes: {
          'a': ['href', 'target'],
          'img': ['src', 'alt', 'width', 'height']
        },
        allowedSchemes: ['http', 'https', 'data']
      });

      const lessonData = {
        name: DOMPurify.sanitize(title),
        content: sanitizedContent,
        instructorName: DOMPurify.sanitize(instructorName),
        date: DOMPurify.sanitize(date),
        time: DOMPurify.sanitize(time),
        maxCount: parseInt(maxCount)
      };

      if (isEdit) {
        lessonData.uid = location.state.lesson.uid;
        await lessons.updateLesson(lessonData);
        showSuccessToast('강습이 수정되었습니다.');
      } else {
        await lessons.createLesson(lessonData);
        showSuccessToast('강습이 등록되었습니다.');
      }

      navigate('/lesson-reservation');
    } catch (error) {
      console.error('강습 등록/수정 실패:', error);
      showErrorToast(isEdit ? '강습 수정에 실패했습니다.' : '강습 등록에 실패했습니다.');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  return (
    <div className="p-6">
      <ToasterConfig />
      
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEdit ? '강습 수정' : '강습 등록'}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder="강습명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="강사명을 입력하세요"
              />
            </div>
            <div>
              <input
                type="number"
                value={maxCount}
                onChange={(e) => setMaxCount(parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="정원을 입력하세요"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="mt-1">
              <QuillEditor
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-[600px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8">
            <button
              type="button"
              onClick={() => navigate('/lesson')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isEdit ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonWrite; 