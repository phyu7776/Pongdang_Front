# Pongdang Frontend

Pongdang 웹 애플리케이션의 프론트엔드 프로젝트입니다.

## 주요 기능

- 사용자 인증 (로그인, 회원가입)
- 사용자 정보 관리
  - 기본 정보 수정 (이름, 닉네임, 생년월일)
  - 비밀번호 변경
- 시스템 설정
- 사용자 관리

## 기술 스택

- React
- Tailwind CSS
- Axios
- Zustand (상태 관리)

## 구동 방법

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 빌드
```bash
npm run build
```

## 환경 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://your-api-url
```

## API 문서

API 엔드포인트와 요청/응답 형식은 `src/api/endpoints.js` 파일에서 확인할 수 있습니다.
