const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// 리뷰 작성
router.post('/', authenticate, async (req, res) => {
  try {
    const { hotelId, bookingId, rating, comment, images } = req.body;

    // 예약 확인
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: '유효하지 않은 예약입니다.' });
    }

    // 리뷰 생성
    const review = new Review({
      user: req.user._id,
      hotel: hotelId,
      booking: bookingId,
      rating,
      comment,
      images
    });

    await review.save();

    // 호텔 평점 업데이트
    const reviews = await Review.find({ hotel: hotelId, status: 'active' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    // 포인트 적립
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 500 }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: '리뷰 작성 중 오류가 발생했습니다.' });
  }
});

// 호텔 리뷰 목록
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      hotel: req.params.hotelId,
      status: 'active'
    })
    .populate('user', 'name')
    .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '리뷰 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 리뷰 신고 (사업자)
router.post('/:id/report', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        reported: true,
        reportReason: reason,
        reportedBy: req.user._id,
        reportStatus: 'pending'
      },
      { new: true }
    );

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: '리뷰 신고 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
