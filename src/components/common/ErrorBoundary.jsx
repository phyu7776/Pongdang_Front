import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 오류 경계 컴포넌트
 * 자식 컴포넌트 트리에서 발생하는 JavaScript 오류를 캐치하고 
 * 오류 발생 시 폴백 UI를 렌더링합니다.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI를 표시하도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보를 상태에 저장
    this.setState({ errorInfo });
    
    // 에러 로깅
    console.error('ErrorBoundary caught an error', error, errorInfo);
    
    // 에러 보고 서비스에 에러를 보낼 수 있습니다.
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI 렌더링
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[300px] bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            문제가 발생했습니다
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
            페이지를 표시하는 동안 오류가 발생했습니다.
          </p>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded overflow-auto text-sm mb-4 max-w-full max-h-[200px] text-red-600 dark:text-red-400">
            {this.state.error && this.state.error.toString()}
          </pre>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary; 