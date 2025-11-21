const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { authenticate, authorize } = require('../middleware/auth');

// 모든 라우트에 관리자 권한 체크
router.use(authenticate, authorize('admin'));

// 대시보드 통계
router.get('/dashboard/stats', async (req, res) => {
  try {
    // 총 예약 수
    const totalBookings = await Booking.countDocuments();
    
    // 총 매출
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    // 총 사업자 수
    const totalBusiness = await User.countDocuments({ role: 'business' });

    // 총 호텔 수
    const totalHotels = await Hotel.countDocuments();

    res.json({
      totalBookings,
      totalRevenue,
      totalBusiness,
      totalHotels
    });
  } catch (error) {
    res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다.' });
  }
});

// 사업자 관리 - 목록
router.get('/business', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    const query = { role: 'business' };
    if (status) query.businessStatus = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const businesses = await User.find(query)
      .select('-password')
      .sort('-createdAt');

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: '사업자 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 사업자 승인
router.put('/business/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { businessStatus: 'approved' },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '사업자 승인 중 오류가 발생했습니다.' });
  }
});

// 사업자 거부
router.put('/business/:id/reject', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { businessStatus: 'rejected' },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '사업자 거부 중 오류가 발생했습니다.' });
  }
});

// 사업자 차단
router.put('/business/:id/block', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { businessStatus: 'blocked' },
      { new: true }
    ).select('-password');

    // 해당 사업자의 모든 호텔 비활성화
    await Hotel.updateMany(
      { owner: req.params.id },
      { status: 'inactive' }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '사업자 차단 중 오류가 발생했습니다.' });
  }
});

// 신고된 리뷰 목록
router.get('/reviews/reported', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      reported: true,
      reportStatus: 'pending'
    })
    .populate('user', 'name email')
    .populate('hotel', 'name')
    .populate('reportedBy', 'name email')
    .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '신고된 리뷰 조회 중 오류가 발생했습니다.' });
  }
});

// 리뷰 신고 승인 (리뷰 숨김)
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { 
        reportStatus: 'approved',
        status: 'hidden'
      },
      { new: true }
    );

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: '리뷰 신고 처리 중 오류가 발생했습니다.' });
  }
});

// 리뷰 신고 거부
router.put('/reviews/:id/reject', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reportStatus: 'rejected' },
      { new: true }
    );

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: '리뷰 신고 처리 중 오류가 발생했습니다.' });
  }
});

// 예약 관리
router.get('/bookings', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    const query = {};
    if (status) query.bookingStatus = status;

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 호텔 관리
router.get('/hotels', async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort('-createdAt');

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: '호텔 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 호텔 삭제
router.delete('/hotels/:id', async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: '호텔이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '호텔 삭제 중 오류가 발생했습니다.' });
  }
});

// ========== 회원 관리 ==========

// 전체 회원 목록 조회
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, blocked } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }
    if (blocked !== undefined) {
      query.isBlocked = blocked === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt');

    res.json(users);
  } catch (error) {
    console.error('User list error:', error);
    res.status(500).json({ message: '회원 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 회원 상세 정보
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    // 회원의 예약 내역
    const bookings = await Booking.find({ user: req.params.id })
      .populate('hotel', 'name')
      .populate('room', 'name')
      .sort('-createdAt')
      .limit(10);

    // 회원이 작성한 리뷰
    const reviews = await Review.find({ user: req.params.id })
      .populate('hotel', 'name')
      .sort('-createdAt')
      .limit(10);

    // 사업자인 경우 호텔 정보
    let hotels = [];
    if (user.role === 'business') {
      hotels = await Hotel.find({ owner: req.params.id });
    }

    res.json({
      user,
      bookings,
      reviews,
      hotels
    });
  } catch (error) {
    console.error('User detail error:', error);
    res.status(500).json({ message: '회원 정보 조회 중 오류가 발생했습니다.' });
  }
});

// 회원 차단
router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    // 사업자인 경우 모든 호텔 비활성화
    if (user.role === 'business') {
      await Hotel.updateMany(
        { owner: req.params.id },
        { status: 'inactive' }
      );
    }

    res.json({ message: '회원이 차단되었습니다.', user });
  } catch (error) {
    console.error('User block error:', error);
    res.status(500).json({ message: '회원 차단 중 오류가 발생했습니다.' });
  }
});

// 회원 차단 해제
router.put('/users/:id/unblock', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    // 사업자인 경우 승인된 상태라면 호텔 활성화
    if (user.role === 'business' && user.businessStatus === 'approved') {
      await Hotel.updateMany(
        { owner: req.params.id },
        { status: 'active' }
      );
    }

    res.json({ message: '회원 차단이 해제되었습니다.', user });
  } catch (error) {
    console.error('User unblock error:', error);
    res.status(500).json({ message: '회원 차단 해제 중 오류가 발생했습니다.' });
  }
});

// 회원 삭제
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    // 관리자는 삭제 불가
    if (user.role === 'admin') {
      return res.status(403).json({ message: '관리자 계정은 삭제할 수 없습니다.' });
    }

    // 사업자인 경우 호텔 및 객실 삭제
    if (user.role === 'business') {
      const hotels = await Hotel.find({ owner: req.params.id });
      for (const hotel of hotels) {
        await Room.deleteMany({ hotel: hotel._id });
      }
      await Hotel.deleteMany({ owner: req.params.id });
    }

    // 회원의 예약, 리뷰 삭제
    await Booking.deleteMany({ user: req.params.id });
    await Review.deleteMany({ user: req.params.id });

    // 회원 삭제
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: '회원이 삭제되었습니다.' });
  } catch (error) {
    console.error('User delete error:', error);
    res.status(500).json({ message: '회원 삭제 중 오류가 발생했습니다.' });
  }
});

// 전체 리뷰 관리 (신고되지 않은 것 포함)
router.get('/reviews/all', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      // 검색어로 리뷰 내용 또는 호텔명 검색
      const hotels = await Hotel.find({ 
        name: new RegExp(search, 'i') 
      }).select('_id');
      
      query.$or = [
        { comment: new RegExp(search, 'i') },
        { hotel: { $in: hotels.map(h => h._id) } }
      ];
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('All reviews error:', error);
    res.status(500).json({ message: '리뷰 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 리뷰 삭제 (관리자)
router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    console.error('Review delete error:', error);
    res.status(500).json({ message: '리뷰 삭제 중 오류가 발생했습니다.' });
  }
});

// ========== 호텔 태그 관리 ==========

// 호텔에 태그 추가
router.put('/hotels/:id/tags/add', async (req, res) => {
  try {
    const { tags } = req.body;
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tags: { $each: tags } } },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }

    res.json({ message: '태그가 추가되었습니다.', hotel });
  } catch (error) {
    console.error('Add tags error:', error);
    res.status(500).json({ message: '태그 추가 중 오류가 발생했습니다.' });
  }
});

// 호텔에서 태그 제거
router.put('/hotels/:id/tags/remove', async (req, res) => {
  try {
    const { tags } = req.body;
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $pull: { tags: { $in: tags } } },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }

    res.json({ message: '태그가 제거되었습니다.', hotel });
  } catch (error) {
    console.error('Remove tags error:', error);
    res.status(500).json({ message: '태그 제거 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
