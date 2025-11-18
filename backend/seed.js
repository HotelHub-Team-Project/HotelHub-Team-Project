const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./src/models/User');
const Hotel = require('./src/models/Hotel');
const Room = require('./src/models/Room');
const Review = require('./src/models/Review');
const Coupon = require('./src/models/Coupon');

// 샘플 이미지 URL (Unsplash - 무료 고품질 이미지)
const hotelImages = {
  seoul: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
  ],
  busan: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'
  ],
  jeju: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'
  ],
  incheon: [
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    'https://images.unsplash.com/photo-1601395605596-f0a7f0d36e15?w=800'
  ]
};

const roomImages = {
  standard: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
  ],
  deluxe: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'
  ],
  suite: [
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
  ]
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log('🗑️  기존 데이터 삭제 중...');
  await User.deleteMany({});
  await Hotel.deleteMany({});
  await Room.deleteMany({});
  await Review.deleteMany({});
  await Coupon.deleteMany({});
  console.log('✅ 기존 데이터 삭제 완료');
};

const seedUsers = async () => {
  console.log('👤 사용자 데이터 생성 중...');
  
  const users = [
    {
      email: 'happysun0142@gmail.com',
      password: 'love7942@',
      name: '관리자',
      phone: '010-0000-0000',
      role: 'admin'
    },
    {
      email: 'test1@gmail.com',
      password: '123456',
      name: '서울호텔그룹',
      phone: '010-1111-1111',
      role: 'business',
      businessStatus: 'approved'
    },
    {
      email: 'business2@hotel.com',
      password: 'business123',
      name: '부산리조트',
      phone: '010-2222-2222',
      role: 'business',
      businessStatus: 'approved'
    },
    {
      email: 'business3@hotel.com',
      password: 'business123',
      name: '제주호텔앤리조트',
      phone: '010-3333-3333',
      role: 'business',
      businessStatus: 'approved'
    },
    {
      email: 'test2@gmail.com',
      password: '123456',
      name: '김철수',
      phone: '010-4444-4444',
      role: 'user',
      points: 10000
    },
    {
      email: 'user2@test.com',
      password: 'user123',
      name: '이영희',
      phone: '010-5555-5555',
      role: 'user',
      points: 5000
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ ${createdUsers.length}명의 사용자 생성 완료`);
  return createdUsers;
};

const seedHotels = async (users) => {
  console.log('🏨 호텔 데이터 생성 중...');
  
  const business1 = users.find(u => u.email === 'test1@gmail.com');
  const business2 = users.find(u => u.email === 'business2@hotel.com');
  const business3 = users.find(u => u.email === 'business3@hotel.com');

  const hotels = [
    // 서울 호텔
    {
      name: '서울 그랜드 호텔',
      description: '서울 중심부에 위치한 5성급 럭셔리 호텔입니다. 최상의 서비스와 편안한 객실을 제공합니다.',
      location: {
        address: '서울특별시 중구 세종대로 100',
        city: '서울',
        country: '대한민국',
        coordinates: { lat: 37.5665, lng: 126.9780 }
      },
      images: hotelImages.seoul,
      owner: business1._id,
      amenities: ['무료 WiFi', '무료 주차', '수영장', '피트니스', '레스토랑', '바', '스파', '24시간 프런트'],
      rating: 4.8,
      reviewCount: 248,
      status: 'active'
    },
    {
      name: '명동 비즈니스 호텔',
      description: '명동 쇼핑가 중심에 위치한 비즈니스 호텔입니다. 관광과 쇼핑에 최적화되어 있습니다.',
      location: {
        address: '서울특별시 중구 명동길 52',
        city: '서울',
        country: '대한민국',
        coordinates: { lat: 37.5636, lng: 126.9839 }
      },
      images: hotelImages.seoul.slice(1),
      owner: business1._id,
      amenities: ['무료 WiFi', '조식 포함', '24시간 프런트', '비즈니스 센터'],
      rating: 4.5,
      reviewCount: 186,
      status: 'active'
    },
    {
      name: '강남 스타일 호텔',
      description: '강남역 도보 5분 거리의 모던한 호텔입니다. 비즈니스와 레저 모두에 완벽합니다.',
      location: {
        address: '서울특별시 강남구 강남대로 396',
        city: '서울',
        country: '대한민국',
        coordinates: { lat: 37.4979, lng: 127.0276 }
      },
      images: hotelImages.seoul.slice(2),
      owner: business1._id,
      amenities: ['무료 WiFi', '무료 주차', '피트니스', '레스토랑', '루프탑 바'],
      rating: 4.6,
      reviewCount: 152,
      status: 'active'
    },
    // 부산 호텔
    {
      name: '해운대 비치 리조트',
      description: '해운대 해수욕장 정면에 위치한 프리미엄 리조트입니다. 환상적인 오션뷰를 제공합니다.',
      location: {
        address: '부산광역시 해운대구 해운대해변로 264',
        city: '부산',
        country: '대한민국',
        coordinates: { lat: 35.1586, lng: 129.1603 }
      },
      images: hotelImages.busan,
      owner: business2._id,
      amenities: ['무료 WiFi', '무료 주차', '야외 수영장', '피트니스', '레스토랑', '바', '스파', '오션뷰'],
      rating: 4.9,
      reviewCount: 312,
      status: 'active'
    },
    {
      name: '광안리 호텔 앤 스파',
      description: '광안대교 야경을 감상할 수 있는 최고의 위치입니다. 커플과 가족 여행객에게 인기입니다.',
      location: {
        address: '부산광역시 수영구 광안해변로 219',
        city: '부산',
        country: '대한민국',
        coordinates: { lat: 35.1532, lng: 129.1189 }
      },
      images: hotelImages.busan.slice(1),
      owner: business2._id,
      amenities: ['무료 WiFi', '무료 주차', '스파', '레스토랑', '루프탑', '오션뷰'],
      rating: 4.7,
      reviewCount: 198,
      status: 'active'
    },
    {
      name: '부산역 비즈니스 호텔',
      description: '부산역에서 도보 2분 거리의 편리한 호텔입니다. 출장과 여행에 최적입니다.',
      location: {
        address: '부산광역시 동구 중앙대로 206',
        city: '부산',
        country: '대한민국',
        coordinates: { lat: 35.1155, lng: 129.0417 }
      },
      images: hotelImages.busan.slice(2),
      owner: business2._id,
      amenities: ['무료 WiFi', '조식 포함', '24시간 프런트', '비즈니스 센터'],
      rating: 4.3,
      reviewCount: 124,
      status: 'active'
    },
    // 제주 호텔
    {
      name: '제주 오션 뷰 리조트',
      description: '제주 서귀포 앞바다가 한눈에 보이는 프리미엄 리조트입니다. 가족 단위 여행객에게 최고입니다.',
      location: {
        address: '제주특별자치도 서귀포시 중문관광로 72',
        city: '제주',
        country: '대한민국',
        coordinates: { lat: 33.2541, lng: 126.4106 }
      },
      images: hotelImages.jeju,
      owner: business3._id,
      amenities: ['무료 WiFi', '무료 주차', '야외 수영장', '키즈클럽', '레스토랑', '바', '스파', '골프장'],
      rating: 4.9,
      reviewCount: 428,
      status: 'active'
    },
    {
      name: '제주시티 호텔',
      description: '제주시 중심가에 위치한 모던한 호텔입니다. 관광과 쇼핑에 편리합니다.',
      location: {
        address: '제주특별자치도 제주시 중앙로 123',
        city: '제주',
        country: '대한민국',
        coordinates: { lat: 33.5097, lng: 126.5219 }
      },
      images: hotelImages.jeju.slice(1),
      owner: business3._id,
      amenities: ['무료 WiFi', '무료 주차', '레스토랑', '피트니스', '24시간 프런트'],
      rating: 4.4,
      reviewCount: 167,
      status: 'active'
    },
    {
      name: '한라산 뷰 펜션',
      description: '한라산이 보이는 조용한 펜션입니다. 힐링과 휴식을 원하는 분들께 추천합니다.',
      location: {
        address: '제주특별자치도 제주시 1100로 2987',
        city: '제주',
        country: '대한민국',
        coordinates: { lat: 33.3846, lng: 126.5333 }
      },
      images: hotelImages.jeju.slice(2),
      owner: business3._id,
      amenities: ['무료 WiFi', '무료 주차', '바비큐', '테라스', '산책로'],
      rating: 4.6,
      reviewCount: 89,
      status: 'active'
    },
    // 인천 호텔
    {
      name: '인천공항 트랜짓 호텔',
      description: '인천국제공항에서 도보 5분 거리의 환승 호텔입니다. 이른 아침 비행이나 늦은 도착에 최적입니다.',
      location: {
        address: '인천광역시 중구 공항로 424',
        city: '인천',
        country: '대한민국',
        coordinates: { lat: 37.4602, lng: 126.4407 }
      },
      images: hotelImages.incheon,
      owner: business1._id,
      amenities: ['무료 WiFi', '24시간 프런트', '공항 셔틀', '짐 보관', '조식 포함'],
      rating: 4.5,
      reviewCount: 276,
      status: 'active'
    },
    {
      name: '송도 센트럴파크 호텔',
      description: '송도 센트럴파크 앞에 위치한 럭셔리 호텔입니다. 비즈니스와 관광 모두에 완벽합니다.',
      location: {
        address: '인천광역시 연수구 센트럴로 160',
        city: '인천',
        country: '대한민국',
        coordinates: { lat: 37.3895, lng: 126.6435 }
      },
      images: hotelImages.incheon.slice(1),
      owner: business1._id,
      amenities: ['무료 WiFi', '무료 주차', '수영장', '피트니스', '레스토랑', '바', '비즈니스 센터'],
      rating: 4.7,
      reviewCount: 143,
      status: 'active'
    }
  ];

  const createdHotels = await Hotel.insertMany(hotels);
  console.log(`✅ ${createdHotels.length}개의 호텔 생성 완료`);
  return createdHotels;
};

const seedRooms = async (hotels) => {
  console.log('🛏️  객실 데이터 생성 중...');
  
  const rooms = [];

  for (const hotel of hotels) {
    // 각 호텔마다 3-4개의 객실 타입 생성
    const hotelRooms = [
      {
        hotel: hotel._id,
        name: '스탠다드 더블',
        type: 'Standard',
        description: '편안한 더블 베드가 있는 아늑한 객실입니다.',
        price: Math.floor(Math.random() * 50000) + 80000, // 80,000 - 130,000
        capacity: { adults: 2, children: 1 },
        size: 25,
        beds: '더블 베드 1개',
        images: roomImages.standard,
        amenities: ['무료 WiFi', '에어컨', '미니바', 'TV', '금고', '헤어드라이어'],
        totalRooms: 10,
        availableRooms: Math.floor(Math.random() * 5) + 5,
        status: 'available'
      },
      {
        hotel: hotel._id,
        name: '디럭스 트윈',
        type: 'Deluxe',
        description: '널찍한 공간에 트윈 베드가 있는 고급 객실입니다.',
        price: Math.floor(Math.random() * 70000) + 120000, // 120,000 - 190,000
        capacity: { adults: 2, children: 2 },
        size: 35,
        beds: '싱글 베드 2개',
        images: roomImages.deluxe,
        amenities: ['무료 WiFi', '에어컨', '미니바', 'TV', '금고', '헤어드라이어', '소파', '책상'],
        totalRooms: 8,
        availableRooms: Math.floor(Math.random() * 4) + 3,
        status: 'available'
      },
      {
        hotel: hotel._id,
        name: '이그제큐티브 스위트',
        type: 'Suite',
        description: '별도의 거실이 있는 프리미엄 스위트룸입니다.',
        price: Math.floor(Math.random() * 100000) + 200000, // 200,000 - 300,000
        capacity: { adults: 3, children: 2 },
        size: 50,
        beds: '킹 베드 1개 + 소파베드',
        images: roomImages.suite,
        amenities: ['무료 WiFi', '에어컨', '미니바', 'TV', '금고', '헤어드라이어', '소파', '책상', '욕조', '거실'],
        totalRooms: 5,
        availableRooms: Math.floor(Math.random() * 3) + 2,
        status: 'available'
      }
    ];

    // 일부 호텔에는 추가 객실 타입
    if (Math.random() > 0.5) {
      hotelRooms.push({
        hotel: hotel._id,
        name: '프리미엄 오션뷰',
        type: 'Premium',
        description: '탁 트인 바다 전망을 감상할 수 있는 최고급 객실입니다.',
        price: Math.floor(Math.random() * 150000) + 250000, // 250,000 - 400,000
        capacity: { adults: 4, children: 2 },
        size: 65,
        beds: '킹 베드 1개 + 더블 베드 1개',
        images: roomImages.suite.slice(1),
        amenities: ['무료 WiFi', '에어컨', '미니바', 'TV', '금고', '헤어드라이어', '소파', '책상', '욕조', '거실', '오션뷰', '발코니'],
        totalRooms: 3,
        availableRooms: Math.floor(Math.random() * 2) + 1,
        status: 'available'
      });
    }

    rooms.push(...hotelRooms);
  }

  const createdRooms = await Room.insertMany(rooms);
  console.log(`✅ ${createdRooms.length}개의 객실 생성 완료`);
  return createdRooms;
};

const seedReviews = async (users, hotels) => {
  console.log('⭐ 리뷰 데이터 생성 중...');
  
  const user1 = users.find(u => u.email === 'test2@gmail.com');
  const user2 = users.find(u => u.email === 'user2@test.com');

  const reviewTexts = [
    '정말 좋은 호텔이었습니다! 직원분들도 친절하시고 시설도 깨끗했어요.',
    '가격 대비 훌륭한 숙소입니다. 다음에 또 방문하고 싶어요.',
    '위치가 정말 좋고 주변에 맛집도 많아서 편리했습니다.',
    '객실이 넓고 깨끗해서 만족스러웠습니다. 가족 여행으로 최고!',
    '뷰가 정말 환상적이었어요. 특히 일몰이 아름다웠습니다.',
    '조식이 맛있고 다양해서 좋았습니다. 전반적으로 만족스러웠어요.',
    '직원분들이 정말 친절하셨습니다. 감사합니다!',
    '깨끗하고 조용해서 휴식하기 좋았습니다.',
  ];

  const reviews = [];

  // 각 호텔마다 2-4개의 리뷰 생성
  for (const hotel of hotels.slice(0, 8)) {
    const reviewCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        user: Math.random() > 0.5 ? user1._id : user2._id,
        hotel: hotel._id,
        booking: new mongoose.Types.ObjectId(), // 임시 booking ID
        rating: Math.floor(Math.random() * 2) + 4, // 4-5점
        comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        status: 'active',
        reported: false
      });
    }
  }

  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ ${createdReviews.length}개의 리뷰 생성 완료`);
  return createdReviews;
};

const seedCoupons = async (users) => {
  console.log('🎟️  쿠폰 데이터 생성 중...');
  
  const admin = users.find(u => u.role === 'admin');

  const coupons = [
    {
      code: 'WELCOME2025',
      name: '신규 회원 환영 쿠폰',
      description: '처음 방문하신 고객님께 드리는 특별 할인',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 50000,
      maxDiscount: 20000,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      usageLimit: 1,
      status: 'active',
      createdBy: admin._id
    },
    {
      code: 'SUMMER2025',
      name: '여름 휴가 특가',
      description: '여름 성수기 특별 할인 쿠폰',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 100000,
      maxDiscount: 30000,
      validFrom: new Date('2025-06-01'),
      validTo: new Date('2025-08-31'),
      usageLimit: 1,
      status: 'active',
      createdBy: admin._id
    },
    {
      code: 'WEEKEND20',
      name: '주말 특가',
      description: '주말 예약 시 사용 가능한 쿠폰',
      discountType: 'fixed',
      discountValue: 20000,
      minPurchase: 80000,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      usageLimit: 3,
      status: 'active',
      createdBy: admin._id
    },
    {
      code: 'FAMILY50',
      name: '가족 여행 할인',
      description: '가족 단위 예약 시 특별 할인',
      discountType: 'fixed',
      discountValue: 50000,
      minPurchase: 200000,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      usageLimit: 2,
      status: 'active',
      createdBy: admin._id
    },
    {
      code: 'EARLY2025',
      name: '얼리버드 할인',
      description: '30일 전 예약 시 특별 할인',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 150000,
      maxDiscount: 50000,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      usageLimit: 1,
      status: 'active',
      createdBy: admin._id
    }
  ];

  const createdCoupons = await Coupon.insertMany(coupons);
  console.log(`✅ ${createdCoupons.length}개의 쿠폰 생성 완료`);
  return createdCoupons;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\n🌱 데이터베이스 시딩 시작...\n');
    
    await clearDatabase();
    
    const users = await seedUsers();
    const hotels = await seedHotels(users);
    const rooms = await seedRooms(hotels);
    const reviews = await seedReviews(users, hotels);
    const coupons = await seedCoupons(users);
    
    console.log('\n✅ 모든 데이터 생성 완료!\n');
    console.log('📊 생성된 데이터 요약:');
    console.log(`   - 사용자: ${users.length}명`);
    console.log(`   - 호텔: ${hotels.length}개`);
    console.log(`   - 객실: ${rooms.length}개`);
    console.log(`   - 리뷰: ${reviews.length}개`);
    console.log(`   - 쿠폰: ${coupons.length}개\n`);
    
    console.log('🔐 테스트 계정:');
    console.log('   관리자: happysun0142@gmail.com / love7942@');
    console.log('   사업자: test1@gmail.com / 123456');
    console.log('   사용자: test2@gmail.com / 123456\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 시딩 실패:', error);
    process.exit(1);
  }
};

seedDatabase();
