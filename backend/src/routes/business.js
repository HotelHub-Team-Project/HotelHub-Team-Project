const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { authenticate, authorize, checkBusinessApproval } = require('../middleware/auth');

// 모든 라우트에 사업자 권한 체크
router.use(authenticate, authorize('business'), checkBusinessApproval);

// 대시보드 통계
router.get('/dashboard/stats', async (req, res) => {
  try {
    // 내 호텔 목록
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    // 총 예약 수
    const totalBookings = await Booking.countDocuments({ 
      hotel: { $in: hotelIds } 
    });

    // 총 매출
    const revenue = await Booking.aggregate([
      { 
        $match: { 
          hotel: { $in: hotelIds },
          paymentStatus: 'completed'
        } 
      },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    // 리뷰 수
    const totalReviews = await Review.countDocuments({ 
      hotel: { $in: hotelIds },
      status: 'active'
    });

    // 호텔 수
    const totalHotels = myHotels.length;

    res.json({
      totalBookings,
      totalRevenue,
      totalReviews,
      totalHotels
    });
  } catch (error) {
    res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다.' });
  }
});

// 내 호텔 목록
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id })
      .sort('-createdAt');

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: '호텔 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 호텔 등록
router.post('/hotels', async (req, res) => {
  try {
    const hotel = new Hotel({
      ...req.body,
      owner: req.user._id,
      status: 'pending'
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: '호텔 등록 중 오류가 발생했습니다.' });
  }
});

// 호텔 수정
router.put('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: '호텔 수정 중 오류가 발생했습니다.' });
  }
});

// 호텔 삭제
router.delete('/hotels/:id', async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ 
      _id: req.params.id,
      owner: req.user._id
    });

    res.json({ message: '호텔이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '호텔 삭제 중 오류가 발생했습니다.' });
  }
});

// 내 객실 목록
router.get('/rooms', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const rooms = await Room.find({ hotel: { $in: hotelIds } })
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: '객실 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 예약 관리
router.get('/bookings', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate('user', 'name email phone')
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 리뷰 관리
router.get('/reviews', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const reviews = await Review.find({ hotel: { $in: hotelIds } })
      .populate('user', 'name')
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '리뷰 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 매출 통계 (월별)
router.get('/revenue/monthly', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const revenue = await Booking.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$finalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: '매출 통계 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
