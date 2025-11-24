# HotelHub API 명세서

**버전**: 1.0  
**Base URL**: `http://localhost:3000/api`  
**인증 방식**: JWT Bearer Token

---

## 📑 목차
1. [인증 (Auth)](#1-인증-auth)
2. [사용자 (Users)](#2-사용자-users)
3. [호텔 (Hotels)](#3-호텔-hotels)
4. [객실 (Rooms)](#4-객실-rooms)
5. [예약 (Bookings)](#5-예약-bookings)
6. [리뷰 (Reviews)](#6-리뷰-reviews)
7. [결제 (Payments)](#7-결제-payments)
8. [쿠폰 (Coupons)](#8-쿠폰-coupons)
9. [찜 (Favorites)](#9-찜-favorites)
10. [사업자 (Business)](#10-사업자-business)
11. [관리자 (Admin)](#11-관리자-admin)
12. [활동 로그 (Activity Logs)](#12-활동-로그-activity-logs)
13. [조회 기록 (View History)](#13-조회-기록-view-history)

---

## 1. 인증 (Auth)

### 1.1 회원가입
```http
POST /auth/register
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response** `201 Created`
```json
{
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user"
  }
}
```

---

### 1.2 로그인
```http
POST /auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `200 OK`
```json
{
  "message": "로그인 성공",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "points": 1000
  }
}
```

---

### 1.3 카카오 로그인 (OAuth)
```http
GET /auth/kakao
```
- 카카오 인증 페이지로 리다이렉트

```http
GET /auth/kakao/callback?code={KAKAO_CODE}
```
- 카카오 인증 완료 후 콜백
- 자동으로 회원가입/로그인 처리
- JWT 토큰 반환

---

### 1.4 내 정보 조회
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "_id": "67412a...",
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "user",
  "points": 1000,
  "favorites": ["hotel_id_1", "hotel_id_2"],
  "createdAt": "2025-11-01T00:00:00.000Z"
}
```

---

## 2. 사용자 (Users)

### 2.1 사용자 목록 조회 (관리자)
```http
GET /users
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `page` (number): 페이지 번호 (default: 1)
- `limit` (number): 페이지당 개수 (default: 20)
- `role` (string): 역할 필터 (user/business/admin)

**Response** `200 OK`
```json
{
  "users": [
    {
      "_id": "67412a...",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "createdAt": "2025-11-01T00:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

---

### 2.2 사용자 상세 조회
```http
GET /users/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "_id": "67412a...",
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "user",
  "points": 1000,
  "createdAt": "2025-11-01T00:00:00.000Z"
}
```

---

### 2.3 사용자 정보 수정
```http
PUT /users/:id
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "name": "홍길동",
  "phone": "010-9876-5432"
}
```

**Response** `200 OK`
```json
{
  "message": "사용자 정보가 수정되었습니다.",
  "user": { /* updated user */ }
}
```

---

### 2.4 사업자 신청
```http
POST /users/business-apply
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "businessName": "호텔ABC",
  "businessNumber": "123-45-67890",
  "bankAccount": "우리은행 1002-123-456789"
}
```

**Response** `200 OK`
```json
{
  "message": "사업자 신청이 완료되었습니다. 승인을 기다려주세요."
}
```

---

## 3. 호텔 (Hotels)

### 3.1 호텔 목록 조회
```http
GET /hotels
```

**Query Parameters**
- `city` (string): 도시 (서울/부산/제주/인천)
- `checkIn` (date): 체크인 날짜 (YYYY-MM-DD)
- `checkOut` (date): 체크아웃 날짜 (YYYY-MM-DD)
- `guests` (number): 투숙 인원
- `hotelType` (string): 호텔 타입 (luxury/business/resort/boutique/pension)
- `roomType` (string): 객실 타입 (standard/deluxe/suite/premium)
- `bedType` (string): 침대 타입 (single/double/twin/queen/king)
- `viewType` (string): 뷰 타입 (ocean/mountain/city/garden)
- `amenities` (array): 편의시설 (comma separated)
- `minPrice` (number): 최소 가격
- `maxPrice` (number): 최대 가격
- `minRating` (number): 최소 평점 (1-5)
- `tags` (array): 호텔 태그 (comma separated)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "hotels": [
    {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "description": "5성급 럭셔리 호텔...",
      "location": {
        "address": "서울특별시 중구 세종대로 100",
        "city": "서울",
        "coordinates": {
          "lat": 37.5665,
          "lng": 126.9780
        }
      },
      "hotelType": "luxury",
      "tags": ["인기", "럭셔리"],
      "images": ["https://..."],
      "amenities": ["WiFi", "주차", "수영장"],
      "rating": 4.5,
      "reviewCount": 120,
      "minPrice": 150000,
      "availableRooms": 5
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

### 3.2 호텔 상세 조회
```http
GET /hotels/:id
```

**Query Parameters**
- `checkIn` (date): 체크인 날짜 (객실 가용성 확인)
- `checkOut` (date): 체크아웃 날짜

**Response** `200 OK`
```json
{
  "_id": "hotel_id_1",
  "name": "서울 그랜드 호텔",
  "description": "서울 중심부에 위치한 5성급 럭셔리 호텔...",
  "location": {
    "address": "서울특별시 중구 세종대로 100",
    "city": "서울",
    "coordinates": {
      "lat": 37.5665,
      "lng": 126.9780
    }
  },
  "hotelType": "luxury",
  "tags": ["인기", "럭셔리", "비즈니스"],
  "images": [
    "https://s3.../image1.jpg",
    "https://s3.../image2.jpg"
  ],
  "amenities": [
    "WiFi",
    "무료 주차",
    "수영장",
    "헬스장",
    "스파",
    "레스토랑",
    "룸서비스",
    "비즈니스 센터"
  ],
  "rating": 4.5,
  "reviewCount": 120,
  "owner": {
    "_id": "user_id_1",
    "name": "김사장",
    "businessInfo": { /* business info */ }
  },
  "rooms": [
    {
      "_id": "room_id_1",
      "name": "디럭스 더블",
      "type": "디럭스",
      "roomType": "deluxe",
      "bedType": "double",
      "viewType": "city",
      "price": 150000,
      "maxGuests": 2,
      "availableRooms": 3,
      "images": ["https://..."]
    }
  ],
  "reviews": [
    {
      "_id": "review_id_1",
      "user": { "name": "홍길동" },
      "rating": 5,
      "comment": "정말 좋았어요!",
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ],
  "status": "approved",
  "createdAt": "2025-10-01T00:00:00.000Z"
}
```

---

### 3.3 호텔 등록 (사업자)
```http
POST /hotels
Authorization: Bearer {business_token}
Content-Type: multipart/form-data
```

**Request Body (form-data)**
```
name: "새 호텔"
description: "호텔 설명..."
location[address]: "서울특별시..."
location[city]: "서울"
location[coordinates][lat]: 37.5665
location[coordinates][lng]: 126.9780
hotelType: "business"
amenities[]: "WiFi"
amenities[]: "주차"
images: [File, File, ...]
```

**Response** `201 Created`
```json
{
  "message": "호텔이 등록되었습니다. 승인을 기다려주세요.",
  "hotel": { /* created hotel */ }
}
```

---

### 3.4 호텔 수정 (사업자)
```http
PUT /hotels/:id
Authorization: Bearer {business_token}
Content-Type: multipart/form-data
```

**Request Body**
```
name: "수정된 호텔명"
description: "수정된 설명"
...
```

**Response** `200 OK`
```json
{
  "message": "호텔 정보가 수정되었습니다.",
  "hotel": { /* updated hotel */ }
}
```

---

### 3.5 호텔 삭제 (사업자/관리자)
```http
DELETE /hotels/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "message": "호텔이 삭제되었습니다."
}
```

---

## 4. 객실 (Rooms)

### 4.1 객실 목록 조회
```http
GET /rooms
```

**Query Parameters**
- `hotel` (string): 호텔 ID (required)
- `checkIn` (date): 체크인 날짜
- `checkOut` (date): 체크아웃 날짜
- `guests` (number): 투숙 인원
- `roomType` (string): 객실 타입
- `bedType` (string): 침대 타입
- `minPrice` (number): 최소 가격
- `maxPrice` (number): 최대 가격

**Response** `200 OK`
```json
{
  "rooms": [
    {
      "_id": "room_id_1",
      "hotel": "hotel_id_1",
      "name": "디럭스 더블룸",
      "description": "넓고 편안한 객실...",
      "type": "디럭스",
      "roomType": "deluxe",
      "bedType": "double",
      "viewType": "city",
      "price": 150000,
      "maxGuests": 2,
      "images": ["https://..."],
      "amenities": ["WiFi", "TV", "미니바"],
      "availableRooms": 3
    }
  ]
}
```

---

### 4.2 객실 상세 조회
```http
GET /rooms/:id
```

**Response** `200 OK`
```json
{
  "_id": "room_id_1",
  "hotel": {
    "_id": "hotel_id_1",
    "name": "서울 그랜드 호텔",
    "location": { /* location info */ }
  },
  "name": "디럭스 더블룸",
  "description": "넓고 편안한 객실...",
  "type": "디럭스",
  "roomType": "deluxe",
  "bedType": "double",
  "viewType": "city",
  "price": 150000,
  "maxGuests": 2,
  "images": ["https://..."],
  "amenities": ["WiFi", "TV", "미니바", "욕조"],
  "availableRooms": 3,
  "createdAt": "2025-10-15T00:00:00.000Z"
}
```

---

### 4.3 객실 등록 (사업자)
```http
POST /rooms
Authorization: Bearer {business_token}
Content-Type: multipart/form-data
```

**Request Body**
```
hotel: "hotel_id_1"
name: "스위트룸"
description: "최고급 스위트..."
type: "스위트"
roomType: "suite"
bedType: "king"
viewType: "ocean"
price: 300000
maxGuests: 4
availableRooms: 2
amenities[]: "WiFi"
amenities[]: "욕조"
images: [File, File]
```

**Response** `201 Created`
```json
{
  "message": "객실이 등록되었습니다.",
  "room": { /* created room */ }
}
```

---

### 4.4 객실 수정 (사업자)
```http
PUT /rooms/:id
Authorization: Bearer {business_token}
```

**Request Body**
```json
{
  "price": 180000,
  "availableRooms": 5
}
```

**Response** `200 OK`
```json
{
  "message": "객실 정보가 수정되었습니다.",
  "room": { /* updated room */ }
}
```

---

### 4.5 객실 삭제 (사업자)
```http
DELETE /rooms/:id
Authorization: Bearer {business_token}
```

**Response** `200 OK`
```json
{
  "message": "객실이 삭제되었습니다."
}
```

---

## 5. 예약 (Bookings)

### 5.1 예약 생성
```http
POST /bookings
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1",
  "room": "room_id_1",
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-03",
  "guests": {
    "adults": 2,
    "children": 0
  },
  "totalPrice": 300000,
  "discountAmount": 30000,
  "finalPrice": 270000,
  "usedCoupons": ["coupon_id_1"],
  "usedPoints": 10000,
  "specialRequests": "높은 층 배정 부탁드립니다.",
  "tossOrderId": "order_123456",
  "tossPaymentKey": "payment_key_abc"
}
```

**Response** `201 Created`
```json
{
  "message": "예약이 완료되었습니다.",
  "booking": {
    "_id": "booking_id_1",
    "user": "user_id_1",
    "hotel": { /* hotel info */ },
    "room": { /* room info */ },
    "checkIn": "2025-12-01T00:00:00.000Z",
    "checkOut": "2025-12-03T00:00:00.000Z",
    "guests": { "adults": 2, "children": 0 },
    "totalPrice": 300000,
    "discountAmount": 30000,
    "finalPrice": 270000,
    "bookingStatus": "confirmed",
    "createdAt": "2025-11-24T00:00:00.000Z"
  }
}
```

---

### 5.2 예약 목록 조회 (내 예약)
```http
GET /bookings/my
Authorization: Bearer {token}
```

**Query Parameters**
- `status` (string): 예약 상태 (confirmed/cancelled/completed)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "bookings": [
    {
      "_id": "booking_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."]
      },
      "room": {
        "_id": "room_id_1",
        "name": "디럭스 더블룸",
        "type": "디럭스"
      },
      "checkIn": "2025-12-01T00:00:00.000Z",
      "checkOut": "2025-12-03T00:00:00.000Z",
      "guests": { "adults": 2, "children": 0 },
      "finalPrice": 270000,
      "bookingStatus": "confirmed",
      "createdAt": "2025-11-24T00:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

---

### 5.3 사업자 예약 조회 (월별 캘린더용)
```http
GET /bookings/business/my
Authorization: Bearer {business_token}
```

**Query Parameters**
- `year` (number): 연도 (required)
- `month` (number): 월 (1-12, required)

**Response** `200 OK`
```json
{
  "bookings": [
    {
      "_id": "booking_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔"
      },
      "room": {
        "_id": "room_id_1",
        "name": "디럭스 더블룸",
        "type": "디럭스"
      },
      "user": {
        "_id": "user_id_1",
        "name": "홍길동",
        "email": "user@example.com"
      },
      "checkIn": "2025-12-01T00:00:00.000Z",
      "checkOut": "2025-12-03T00:00:00.000Z",
      "guests": { "adults": 2, "children": 0 },
      "finalPrice": 270000,
      "bookingStatus": "confirmed"
    }
  ]
}
```

---

### 5.4 예약 상세 조회
```http
GET /bookings/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "_id": "booking_id_1",
  "user": {
    "_id": "user_id_1",
    "name": "홍길동",
    "email": "user@example.com"
  },
  "hotel": {
    "_id": "hotel_id_1",
    "name": "서울 그랜드 호텔",
    "location": { /* location info */ },
    "images": ["https://..."]
  },
  "room": {
    "_id": "room_id_1",
    "name": "디럭스 더블룸",
    "type": "디럭스",
    "price": 150000
  },
  "checkIn": "2025-12-01T00:00:00.000Z",
  "checkOut": "2025-12-03T00:00:00.000Z",
  "guests": { "adults": 2, "children": 0 },
  "totalPrice": 300000,
  "discountAmount": 30000,
  "usedPoints": 10000,
  "finalPrice": 270000,
  "usedCoupons": [
    {
      "_id": "coupon_id_1",
      "code": "WELCOME10",
      "name": "신규 회원 10% 할인"
    }
  ],
  "specialRequests": "높은 층 배정 부탁드립니다.",
  "bookingStatus": "confirmed",
  "tossOrderId": "order_123456",
  "tossPaymentKey": "payment_key_abc",
  "modificationHistory": [],
  "createdAt": "2025-11-24T00:00:00.000Z"
}
```

---

### 5.5 예약 수정
```http
PUT /bookings/:id
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "checkIn": "2025-12-02",
  "checkOut": "2025-12-04",
  "specialRequests": "금연 객실 부탁드립니다."
}
```

**Response** `200 OK`
```json
{
  "message": "예약이 수정되었습니다.",
  "booking": { /* updated booking */ }
}
```

---

### 5.6 예약 취소
```http
POST /bookings/:id/cancel
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "message": "예약이 취소되었습니다. 환불은 3-5일 소요됩니다.",
  "booking": {
    /* booking with bookingStatus: "cancelled" */
  }
}
```

---

## 6. 리뷰 (Reviews)

### 6.1 리뷰 목록 조회
```http
GET /reviews
```

**Query Parameters**
- `hotel` (string): 호텔 ID
- `user` (string): 사용자 ID
- `minRating` (number): 최소 평점
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "reviews": [
    {
      "_id": "review_id_1",
      "user": {
        "_id": "user_id_1",
        "name": "홍길동"
      },
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔"
      },
      "booking": "booking_id_1",
      "rating": 5,
      "comment": "정말 훌륭한 호텔이었습니다!",
      "response": "감사합니다!",
      "isReported": false,
      "createdAt": "2025-11-20T00:00:00.000Z",
      "updatedAt": "2025-11-20T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

### 6.2 리뷰 작성
```http
POST /reviews
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1",
  "booking": "booking_id_1",
  "rating": 5,
  "comment": "정말 좋았어요!"
}
```

**Response** `201 Created`
```json
{
  "message": "리뷰가 작성되었습니다.",
  "review": { /* created review */ }
}
```

---

### 6.3 리뷰 수정
```http
PUT /reviews/:id
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "rating": 4,
  "comment": "수정된 리뷰 내용"
}
```

**Response** `200 OK`
```json
{
  "message": "리뷰가 수정되었습니다.",
  "review": { /* updated review */ }
}
```

---

### 6.4 리뷰 삭제
```http
DELETE /reviews/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "message": "리뷰가 삭제되었습니다."
}
```

---

### 6.5 리뷰 신고
```http
POST /reviews/:id/report
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "reason": "부적절한 내용"
}
```

**Response** `200 OK`
```json
{
  "message": "리뷰가 신고되었습니다."
}
```

---

### 6.6 리뷰 응답 작성 (사업자)
```http
POST /reviews/:id/response
Authorization: Bearer {business_token}
```

**Request Body**
```json
{
  "response": "소중한 리뷰 감사합니다!"
}
```

**Response** `200 OK`
```json
{
  "message": "응답이 작성되었습니다.",
  "review": { /* updated review */ }
}
```

---

## 7. 결제 (Payments)

### 7.1 Toss 결제 승인
```http
POST /payments/toss/confirm
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "orderId": "order_123456",
  "paymentKey": "payment_key_abc",
  "amount": 270000
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "결제가 승인되었습니다.",
  "payment": {
    "orderId": "order_123456",
    "paymentKey": "payment_key_abc",
    "status": "DONE",
    "approvedAt": "2025-11-24T12:34:56.000Z"
  }
}
```

---

### 7.2 결제 취소 (환불)
```http
POST /payments/toss/cancel
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "paymentKey": "payment_key_abc",
  "cancelReason": "고객 변심"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "결제가 취소되었습니다.",
  "cancellation": {
    "canceledAt": "2025-11-24T14:00:00.000Z",
    "cancelReason": "고객 변심"
  }
}
```

---

## 8. 쿠폰 (Coupons)

### 8.1 사용 가능한 쿠폰 조회
```http
GET /coupons/available
Authorization: Bearer {token}
```

**Query Parameters**
- `totalPrice` (number): 주문 금액

**Response** `200 OK`
```json
{
  "coupons": [
    {
      "_id": "coupon_id_1",
      "code": "WELCOME10",
      "name": "신규 회원 10% 할인",
      "description": "첫 예약 시 사용 가능",
      "discountType": "percentage",
      "discountValue": 10,
      "minPurchase": 50000,
      "maxDiscount": 50000,
      "validFrom": "2025-11-01T00:00:00.000Z",
      "validTo": "2025-12-31T23:59:59.000Z",
      "isActive": true
    }
  ]
}
```

---

### 8.2 쿠폰 검증
```http
POST /coupons/validate
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "code": "WELCOME10",
  "totalPrice": 270000
}
```

**Response** `200 OK`
```json
{
  "valid": true,
  "coupon": {
    "_id": "coupon_id_1",
    "code": "WELCOME10",
    "discountType": "percentage",
    "discountValue": 10
  },
  "discountAmount": 27000,
  "finalPrice": 243000
}
```

---

### 8.3 쿠폰 생성 (관리자)
```http
POST /coupons
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "code": "SUMMER2025",
  "name": "여름 특가 20% 할인",
  "description": "7-8월 예약 시 사용 가능",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 100000,
  "maxDiscount": 100000,
  "validFrom": "2025-07-01",
  "validTo": "2025-08-31",
  "isActive": true
}
```

**Response** `201 Created`
```json
{
  "message": "쿠폰이 생성되었습니다.",
  "coupon": { /* created coupon */ }
}
```

---

### 8.4 쿠폰 수정 (관리자)
```http
PUT /coupons/:id
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "isActive": false
}
```

**Response** `200 OK`
```json
{
  "message": "쿠폰이 수정되었습니다.",
  "coupon": { /* updated coupon */ }
}
```

---

### 8.5 쿠폰 삭제 (관리자)
```http
DELETE /coupons/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "message": "쿠폰이 삭제되었습니다."
}
```

---

## 9. 찜 (Favorites)

### 9.1 찜 목록 조회
```http
GET /favorites
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "favorites": [
    {
      "_id": "favorite_id_1",
      "user": "user_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."],
        "rating": 4.5,
        "location": { "city": "서울" },
        "minPrice": 150000
      },
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ]
}
```

---

### 9.2 찜 추가
```http
POST /favorites
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1"
}
```

**Response** `201 Created`
```json
{
  "message": "찜 목록에 추가되었습니다.",
  "favorite": { /* created favorite */ }
}
```

---

### 9.3 찜 삭제
```http
DELETE /favorites/:hotelId
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "message": "찜 목록에서 제거되었습니다."
}
```

---

## 10. 사업자 (Business)

### 10.1 내 호텔 목록 조회
```http
GET /business/hotels
Authorization: Bearer {business_token}
```

**Response** `200 OK`
```json
{
  "hotels": [
    {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "status": "approved",
      "rating": 4.5,
      "reviewCount": 120,
      "roomCount": 50,
      "bookingCount": 230
    }
  ]
}
```

---

### 10.2 예약 통계
```http
GET /business/bookings/stats
Authorization: Bearer {business_token}
```

**Query Parameters**
- `hotel` (string): 호텔 ID
- `startDate` (date): 시작 날짜
- `endDate` (date): 종료 날짜

**Response** `200 OK`
```json
{
  "totalBookings": 230,
  "confirmedBookings": 180,
  "cancelledBookings": 20,
  "completedBookings": 30,
  "totalRevenue": 45000000,
  "averagePrice": 195652
}
```

---

### 10.3 리뷰 목록 조회
```http
GET /business/reviews
Authorization: Bearer {business_token}
```

**Query Parameters**
- `hotel` (string): 호텔 ID
- `hasResponse` (boolean): 응답 여부

**Response** `200 OK`
```json
{
  "reviews": [
    {
      "_id": "review_id_1",
      "user": { "name": "홍길동" },
      "hotel": { "name": "서울 그랜드 호텔" },
      "rating": 5,
      "comment": "좋았습니다!",
      "response": null,
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ]
}
```

---

## 11. 관리자 (Admin)

### 11.1 사업자 승인 대기 목록
```http
GET /admin/business/pending
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "pendingUsers": [
    {
      "_id": "user_id_1",
      "email": "business@example.com",
      "name": "김사장",
      "businessInfo": {
        "businessName": "호텔ABC",
        "businessNumber": "123-45-67890",
        "bankAccount": "우리은행 1002-123-456789"
      },
      "businessStatus": "pending",
      "createdAt": "2025-11-15T00:00:00.000Z"
    }
  ]
}
```

---

### 11.2 사업자 승인/거부
```http
POST /admin/business/approve/:userId
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "action": "approve"
}
```
- `action`: "approve" 또는 "reject"

**Response** `200 OK`
```json
{
  "message": "사업자가 승인되었습니다.",
  "user": { /* updated user */ }
}
```

---

### 11.3 호텔 승인 대기 목록
```http
GET /admin/hotels/pending
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "pendingHotels": [
    {
      "_id": "hotel_id_1",
      "name": "새 호텔",
      "owner": {
        "_id": "user_id_1",
        "name": "김사장"
      },
      "location": { "city": "서울" },
      "hotelType": "business",
      "status": "pending",
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ]
}
```

---

### 11.4 호텔 승인/거부
```http
POST /admin/hotels/approve/:hotelId
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "action": "approve"
}
```

**Response** `200 OK`
```json
{
  "message": "호텔이 승인되었습니다.",
  "hotel": { /* updated hotel */ }
}
```

---

### 11.5 호텔 태그 관리
```http
POST /admin/hotels/:hotelId/tags
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "tags": ["인기", "특가", "럭셔리"]
}
```

**Response** `200 OK`
```json
{
  "message": "호텔 태그가 업데이트되었습니다.",
  "hotel": { /* updated hotel */ }
}
```

---

### 11.6 신고된 리뷰 목록
```http
GET /admin/reviews/reported
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "reportedReviews": [
    {
      "_id": "review_id_1",
      "user": { "name": "홍길동" },
      "hotel": { "name": "서울 그랜드 호텔" },
      "comment": "...",
      "isReported": true,
      "reportReason": "부적절한 내용",
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ]
}
```

---

### 11.7 리뷰 삭제 (관리자)
```http
DELETE /admin/reviews/:reviewId
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "message": "리뷰가 삭제되었습니다."
}
```

---

### 11.8 사용자 역할 변경
```http
PUT /admin/users/:userId/role
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "role": "business"
}
```
- `role`: "user" | "business" | "admin"

**Response** `200 OK`
```json
{
  "message": "사용자 역할이 변경되었습니다.",
  "user": { /* updated user */ }
}
```

---

## 12. 활동 로그 (Activity Logs)

### 12.1 활동 로그 조회 (관리자)
```http
GET /activity-logs
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `user` (string): 사용자 ID
- `action` (string): 액션 타입
- `startDate` (date): 시작 날짜
- `endDate` (date): 종료 날짜
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "logs": [
    {
      "_id": "log_id_1",
      "user": {
        "_id": "user_id_1",
        "name": "홍길동",
        "email": "user@example.com"
      },
      "action": "create_booking",
      "target": "Booking",
      "targetId": "booking_id_1",
      "details": {
        "hotel": "서울 그랜드 호텔",
        "checkIn": "2025-12-01",
        "finalPrice": 270000
      },
      "ipAddress": "123.45.67.89",
      "createdAt": "2025-11-24T12:00:00.000Z"
    }
  ],
  "total": 500,
  "page": 1,
  "totalPages": 50
}
```

---

## 13. 조회 기록 (View History)

### 13.1 조회 기록 저장
```http
POST /view-history
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1"
}
```

**Response** `201 Created`
```json
{
  "message": "조회 기록이 저장되었습니다."
}
```

---

### 13.2 조회 기록 조회
```http
GET /view-history
Authorization: Bearer {token}
```

**Query Parameters**
- `limit` (number): 최대 개수 (default: 10)

**Response** `200 OK`
```json
{
  "history": [
    {
      "_id": "history_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."],
        "rating": 4.5,
        "minPrice": 150000
      },
      "viewedAt": "2025-11-24T12:00:00.000Z"
    }
  ]
}
```

---

## 📋 에러 코드

| Status Code | 설명 |
|------------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 500 | 서버 오류 |

### 에러 응답 형식
```json
{
  "error": "에러 메시지"
}
```

---

## 🔒 인증 헤더 형식

모든 인증이 필요한 API는 다음 헤더를 포함해야 합니다:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 참고사항

1. **날짜 형식**: ISO 8601 형식 (YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss.sssZ)
2. **페이지네이션**: 기본값은 page=1, limit=20
3. **이미지 업로드**: multipart/form-data 형식 사용
4. **가격**: 원화(KRW) 기준, 정수형
5. **좌표**: 위도(lat), 경도(lng) 소수점 형식

---

*마지막 업데이트: 2025년 11월 24일*
