*팀장이 혼자 만들어본 프로그램입니다*

# 🏨 HotelHub

> 스마트한 호텔 예약 플랫폼

HotelHub은 사용자, 사업자, 관리자를 위한 종합 호텔 예약 관리 시스템입니다. 직관적인 UI와 강력한 관리 기능으로 효율적인 호텔 예약 경험을 제공합니다.

## ✨ 주요 기능

### 👤 사용자 기능
- 🔍 **호텔 검색 및 필터링**: 지역, 가격, 평점, 편의시설 등 다양한 조건으로 검색
- ❤️ **찜 목록 관리**: 관심 호텔 저장 및 가격 알림 설정
- 📅 **실시간 예약**: 객실 재고 확인 및 즉시 예약
- 💳 **안전한 결제**: Toss Payments 연동 및 카드 정보 암호화 저장
- 🎟️ **쿠폰 & 포인트**: 할인 쿠폰 사용 및 예약 시 포인트 적립 (1%)
- ⭐ **리뷰 작성**: 숙박 후 리뷰 및 평점 작성
- 📊 **예약 내역 관리**: 예약 조회, 수정, 취소

### 🏢 사업자 기능
- 🏨 **호텔 등록 및 관리**: 호텔 정보, 이미지, 편의시설 관리
- 🛏️ **객실 관리**: 객실 타입, 가격, 재고 관리
- 📆 **예약 캘린더**: 월별 예약 현황 확인
- 💬 **리뷰 응답**: 고객 리뷰에 대한 답변 작성
- 📈 **통계 대시보드**: 매출, 예약 현황 통계

### 👨‍💼 관리자 기능
- 📊 **종합 대시보드**: 전체 예약, 매출, 사용자 통계
- ✅ **사업자 승인 관리**: 사업자 신청 검토 및 승인/거부
- 👥 **회원 관리**: 사용자 조회, 차단, 삭제
- 🏷️ **호텔 태그 관리**: 인기, 특가 등 호텔 태그 설정
- 🚨 **신고 리뷰 관리**: 부적절한 리뷰 검토 및 처리
- 🎟️ **쿠폰 생성**: 프로모션 쿠폰 생성 및 관리
- ⚙️ **시스템 설정**: 유지보수 모드, 예약/결제 설정

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **Payment**: Toss Payments API
- **Encryption**: crypto (AES-256-CBC)
- **Email**: Nodemailer
- **File Upload**: Multer
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Routing**: React Router
- **Date Handling**: date-fns
- **Charts**: Chart.js / Recharts

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: nodemon, concurrently
- **Code Quality**: ESLint, Prettier

## 📁 프로젝트 구조

```
HotelHub-Team-Project/
├── backend/
│   ├── src/
│   │   ├── admin/              # 관리자 도메인
│   │   │   ├── controller.js
│   │   │   ├── service.js
│   │   │   └── route.js
│   │   ├── auth/               # 인증 도메인
│   │   ├── user/               # 사용자 도메인
│   │   ├── hotel/              # 호텔 도메인
│   │   ├── room/               # 객실 도메인
│   │   ├── reservation/        # 예약 도메인
│   │   ├── review/             # 리뷰 도메인
│   │   ├── payment/            # 결제 도메인
│   │   ├── coupon/             # 쿠폰 도메인
│   │   ├── favorite/           # 찜 도메인
│   │   ├── common/             # 공통 모듈
│   │   │   ├── authMiddleware.js
│   │   │   ├── response.js
│   │   │   ├── ActivityLogModel.js
│   │   │   ├── ViewHistoryModel.js
│   │   │   └── SystemSettingsModel.js
│   │   ├── config/             # 설정
│   │   │   └── db.js
│   │   ├── middleware/         # 미들웨어
│   │   │   ├── auth.js
│   │   │   └── maintenance.js
│   │   ├── utils/              # 유틸리티
│   │   │   ├── activityLogger.js
│   │   │   └── emailService.js
│   │   ├── routes/             # 레거시 라우트 (호환성)
│   │   └── server.js           # 서버 엔트리
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/         # 재사용 컴포넌트
    │   ├── pages/              # 페이지 컴포넌트
    │   │   ├── admin/          # 관리자 페이지
    │   │   ├── auth/           # 인증 페이지
    │   │   ├── business/       # 사업자 페이지
    │   │   ├── user/           # 사용자 페이지
    │   │   └── info/           # 정보 페이지
    │   ├── layouts/            # 레이아웃
    │   ├── context/            # Context API
    │   ├── hooks/              # Custom Hooks
    │   ├── api/                # API 설정
    │   ├── locales/            # 다국어 지원
    │   └── utils/              # 유틸리티
    ├── package.json
    └── vite.config.js
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- MongoDB 6.x 이상
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론
```bash
git clone https://github.com/HotelHub-Team-Project/HotelHub-Team-Project.git
cd HotelHub-Team-Project
```

#### 2. 환경 변수 설정

**Backend (.env)**
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/hotelhub

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Toss Payments
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Encryption
CARD_ENCRYPT_KEY=your_32_character_encryption_key

# Frontend
FRONT_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

#### 3. 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

#### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

프론트엔드가 http://localhost:5173 에서 실행됩니다.

## 📖 API 문서

자세한 API 명세는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 를 참조하세요.

### 주요 엔드포인트

```
🔐 인증
POST   /api/auth/register        # 회원가입
POST   /api/auth/login           # 로그인
POST   /api/auth/forgot-password # 비밀번호 찾기

👤 사용자
GET    /api/users/me             # 내 정보 조회
PUT    /api/users/me             # 내 정보 수정
DELETE /api/users/me             # 회원탈퇴

🏨 호텔
GET    /api/hotels/search        # 호텔 검색
GET    /api/hotels/featured/list # 추천 호텔
GET    /api/hotels/:id           # 호텔 상세

📅 예약
POST   /api/bookings             # 예약 생성
GET    /api/bookings/my          # 내 예약 목록
PUT    /api/bookings/:id/cancel  # 예약 취소

💳 결제
POST   /api/payments/cards       # 카드 등록
POST   /api/payments/confirm     # 결제 승인
POST   /api/payments/cancel      # 결제 취소

⭐ 리뷰
POST   /api/reviews              # 리뷰 작성
GET    /api/reviews/hotel/:id    # 호텔 리뷰 목록

👨‍💼 관리자
GET    /api/admin/dashboard/stats # 대시보드 통계
GET    /api/admin/business       # 사업자 목록
PUT    /api/admin/business/:id/approve # 사업자 승인
```

## 🎯 핵심 기능 구현

### 1. 도메인 기반 아키텍처 (DDD)
각 도메인은 독립적인 model, service, controller, route로 구성:
- **Model**: 데이터 스키마 정의 (Mongoose)
- **Service**: 비즈니스 로직 처리
- **Controller**: HTTP 요청/응답 처리
- **Route**: API 엔드포인트 정의

### 2. 보안
- JWT 기반 인증 및 역할별 권한 관리
- 비밀번호 bcrypt 암호화
- 카드 정보 AES-256-CBC 암호화
- CORS 설정 및 Rate Limiting

### 3. 결제 시스템
- Toss Payments API 연동
- 카드 정보 안전한 저장
- 포인트 적립 (결제 금액의 1%)
- 환불 처리

### 4. 실시간 재고 관리
- 예약 시 객실 재고 감소
- 취소 시 재고 복구
- 동시성 제어

### 5. 활동 로그
- 사용자 주요 활동 기록
- IP 주소 및 User Agent 저장
- 관리자 모니터링

## 🎨 주요 기능 상세

### 🔍 스마트 검색
- 지역별 호텔 검색
- 가격대, 평점, 호텔 타입 필터
- 편의시설 필터 (WiFi, 주차, 수영장 등)
- 정렬 (가격순, 평점순, 인기순)

### ❤️ 찜 & 가격 알림
- 관심 호텔 저장
- 목표 가격 설정
- 가격 하락 시 이메일 알림 (24시간 쿨다운)

### 📊 대시보드
- **사용자**: 예약 내역, 포인트, 쿠폰
- **사업자**: 월별 예약 현황, 매출 통계, 리뷰 관리
- **관리자**: 전체 통계, 사용자 관리, 신고 처리

### 🎟️ 쿠폰 시스템
- 비율 할인 / 고정 금액 할인
- 최소 구매 금액 설정
- 호텔별 적용 가능 쿠폰
- 사용 횟수 제한

## 🔄 개발 워크플로우

### Git Branch 전략
```
main        # 프로덕션
  ├── develop  # 개발
  │   ├── feature/user-auth
  │   ├── feature/booking-system
  │   └── feature/admin-panel
  └── hotfix   # 긴급 수정
```

### Commit Convention
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
npm test

# 프론트엔드 테스트
cd frontend
npm test
```

## 📦 배포

### 🐳 Docker Desktop으로 배포하기

HotelHub은 Docker를 사용하여 쉽게 배포할 수 있습니다. MongoDB, Backend, Frontend가 모두 컨테이너로 실행됩니다.

#### 사전 요구사항
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- [Warp](https://www.warp.dev/) 또는 다른 터미널 설치 (선택사항)

#### 1단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다:

```bash
# .env.example 파일을 복사하여 .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 실제 값으로 수정:

```env
# JWT Secret (랜덤한 긴 문자열 생성 권장)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Toss Payments (실제 키로 변경)
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key

# Email 설정
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# 카드 암호화 키 (32자 이상)
CARD_ENCRYPT_KEY=your_32_character_encryption_key_here
```

#### 2단계: Docker Desktop 실행

1. Docker Desktop을 실행합니다
2. Docker가 정상적으로 실행 중인지 확인:

```bash
docker --version
docker-compose --version
```

#### 3단계: Docker Compose로 전체 스택 실행

**Warp CMD (또는 다른 터미널)에서 실행:**

```bash
# 프로젝트 루트 디렉토리로 이동
cd C:/HotelHub-Team-Project

# Docker 이미지 빌드 및 컨테이너 실행
docker-compose up -d --build
```

이 명령은 다음을 실행합니다:
- ✅ MongoDB 컨테이너 시작 (포트 27017)
- ✅ Backend API 빌드 및 실행 (포트 3000)
- ✅ Frontend 빌드 및 실행 (포트 80)

#### 4단계: 애플리케이션 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f backend
docker-compose logs -f frontend
```

브라우저에서 접속:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **MongoDB**: mongodb://localhost:27017

#### 5단계: 컨테이너 관리

```bash
# 컨테이너 중지
docker-compose stop

# 컨테이너 시작 (이미 빌드된 경우)
docker-compose start

# 컨테이너 재시작
docker-compose restart

# 컨테이너 중지 및 제거
docker-compose down

# 컨테이너, 볼륨, 이미지 모두 제거
docker-compose down -v --rmi all
```

#### 6단계: Docker Desktop에서 확인

Docker Desktop GUI에서:
1. **Containers** 탭: 실행 중인 컨테이너 확인
2. **Images** 탭: 빌드된 이미지 확인
3. **Volumes** 탭: MongoDB 데이터 볼륨 확인

### 🔧 개별 서비스 Docker 실행

#### Backend만 실행
```bash
cd backend
docker build -t hotelhub-backend .
docker run -p 3000:3000 --env-file ../.env hotelhub-backend
```

#### Frontend만 실행
```bash
cd frontend
docker build -t hotelhub-frontend .
docker run -p 80:80 hotelhub-frontend
```

#### MongoDB만 실행
```bash
docker run -d \
  --name hotelhub-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:7.0
```

### 🚀 프로덕션 배포

#### AWS, GCP, Azure 등에 배포

1. **Docker Hub에 이미지 푸시**

```bash
# Docker Hub 로그인
docker login

# 이미지 태그
docker tag hotelhub-backend:latest your-username/hotelhub-backend:latest
docker tag hotelhub-frontend:latest your-username/hotelhub-frontend:latest

# 이미지 푸시
docker push your-username/hotelhub-backend:latest
docker push your-username/hotelhub-frontend:latest
```

2. **서버에서 실행**

```bash
# 서버에서 이미지 pull
docker pull your-username/hotelhub-backend:latest
docker pull your-username/hotelhub-frontend:latest

# docker-compose.yml 수정 (이미지 사용)
docker-compose -f docker-compose.prod.yml up -d
```

#### Kubernetes 배포 (선택사항)

```bash
# 이미지 빌드
docker-compose build

# Kubernetes 배포 파일 생성
kubectl apply -f k8s/

# 서비스 확인
kubectl get pods
kubectl get services
```

### 📊 모니터링 및 로그

```bash
# 실시간 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend

# 최근 100줄 로그
docker-compose logs --tail=100

# 컨테이너 상태 확인
docker-compose ps

# 리소스 사용량 확인
docker stats
```

### 🔄 업데이트 및 재배포

코드 변경 후:

```bash
# 변경사항 반영하여 재빌드
docker-compose up -d --build

# 특정 서비스만 재빌드
docker-compose up -d --build backend
```

### 🛠️ 트러블슈팅

#### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인 (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :80

# 프로세스 종료
taskkill /PID <PID> /F
```

#### 컨테이너 재시작
```bash
# 모든 컨테이너 재시작
docker-compose restart

# 특정 컨테이너만 재시작
docker-compose restart backend
```

#### 캐시 문제
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache

# 모든 것 제거 후 새로 시작
docker-compose down -v
docker-compose up -d --build
```

#### MongoDB 데이터 초기화
```bash
# 볼륨 포함 모두 제거
docker-compose down -v

# 다시 시작
docker-compose up -d
```

### 기타 배포 옵션

#### 백엔드 배포 (Heroku)
```bash
heroku create hotelhub-api
git push heroku main
heroku config:set NODE_ENV=production
```

#### 프론트엔드 배포 (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

#### 백엔드 배포 (Railway)
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 프로젝트 생성 및 배포
railway login
railway init
railway up
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.


## 📧 문의

- **Email**: happysun0142@gmail.com

## 🙏 감사의 글

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Toss Payments](https://www.tosspayments.com/)
- [Tailwind CSS](https://tailwindcss.com/)

**Last Updated**: 2025년 11월 25일
