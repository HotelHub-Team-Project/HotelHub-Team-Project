const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hotel = require('../models/Hotel');
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

module.exports = router;
