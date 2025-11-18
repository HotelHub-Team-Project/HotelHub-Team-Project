# 🏨 HotelHub - 호텔 예약 플랫폼

호텔 검색, 예약, 결제를 통합 관리하는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 👤 사용자 (User)

- 🔍 호텔 검색 및 상세 보기
- 🏨 객실 예약 / 취소
- 💳 **Toss Payments API** 결제 연동
- 🧾 리뷰 작성 및 포인트 적립
- 🎟️ 쿠폰/포인트 결제
- 💬 문의 등록

### 🏢 사업자 (Business)

- 🏨 호텔 등록 / 수정 / 삭제
- 💰 객실 가격 및 재고 관리
- ⚠️ 리뷰 신고 및 승인 요청
- 📊 매출 통계 조회

### 🛠 관리자 (Admin)

- 📈 매출 및 예약 통계
- ✅ 사업자 승인 / 차단
- ⚠️ 신고 리뷰 처리
- 📢 공지사항 등록
- 💬 문의 답변
- 🎟️ 쿠폰 생성 / 관리

## 🛠 기술 스택

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios
- Toss Payments SDK
- Kakao Map API

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- AWS S3 (이미지 저장)
- Toss Payments API
- Kakao OAuth

## 📁 프로젝트 구조

```
HotelHub-Team-Project/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── user/          # 사용자 페이지
│   │   │   ├── business/      # 사업자 페이지
│   │   │   └── admin/         # 관리자 페이지
│   │   ├── components/        # 공통 컴포넌트
│   │   ├── api/              # API 호출
│   │   └── utils/            # 유틸리티
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/           # API 라우트
│   │   ├── models/           # MongoDB 스키마
│   │   ├── controllers/      # 비즈니스 로직
│   │   ├── middleware/       # 미들웨어
│   │   └── utils/            # 유틸리티
│   └── package.json
├── .env.frontend
├── .env.backend
└── README.md
```

## 🚀 시작하기

### 환경 설정

1. 저장소 클론
```bash
git clone https://github.com/kbusunho/HotelHub-Team-Project.git
cd HotelHub-Team-Project
```

2. Backend 설정
```bash
cd backend
npm install
cp ../.env.backend .env
npm run dev
```

3. Frontend 설정
```bash
cd frontend
npm install
cp ../.env.frontend .env
npm run dev
```

## 🔐 인증 및 권한

- **JWT 기반 인증**
- **역할 기반 접근 제어 (RBAC)**
  - User: 호텔 검색 및 예약
  - Business: 호텔 관리
  - Admin: 시스템 전체 관리

## 💳 결제 시스템

- **Toss Payments API** 연동
- 카드 결제, 간편 결제 지원
- 포인트 및 쿠폰 할인 적용
- 예약 취소 및 환불 처리

## 📊 데이터베이스 스키마

### User
- 사용자 정보, 포인트, 예약 내역

### Hotel
- 호텔 정보, 편의시설, 위치

### Room
- 객실 정보, 가격, 재고

### Booking
- 예약 정보, 결제 상태

### Review
- 리뷰 내용, 평점, 신고 상태

### Coupon
- 쿠폰 정보, 할인율, 유효기간

## 👥 팀원

- **Owner**: kbusunho

## 📝 라이선스

MIT License
