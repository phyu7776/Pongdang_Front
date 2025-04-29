import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boards } from '../api/endpoints';
import { ClipboardList } from 'lucide-react';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';
import DOMPurify from 'dompurify';
import sanitizeHtml from 'sanitize-html';
import QuillEditor from '../components/editor/QuillEditor';

const BoardWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

      if (!window.confirm('게시글을 작성하시겠습니까?')) {
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

      await boards.createBoard({
        name: DOMPurify.sanitize(title),
        content: sanitizedContent,
        isNotice
      });

      showSuccessToast('게시글이 작성되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      showErrorToast('게시글 작성에 실패했습니다.');
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
        <ClipboardList className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          게시글 작성
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
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsNotice(!isNotice)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isNotice ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${isNotice ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              공지사항으로 등록
            </span>
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
              onClick={() => navigate('/board')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite; 