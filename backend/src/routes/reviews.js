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
    const { hotel, rating, comment, images } = req.body;

    // 리뷰 생성
    const review = new Review({
      user: req.user._id,
      hotel: hotel,
      rating,
      comment,
      images
    });

    await review.save();

    // 호텔 평점 업데이트
    const reviews = await Review.find({ hotel: hotel, status: 'active' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Hotel.findByIdAndUpdate(hotel, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Review creation error:', error);
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

// 리뷰 수정
router.put('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    // 본인 리뷰만 수정 가능
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '리뷰를 수정할 권한이 없습니다.' });
    }

    const { rating, comment, images } = req.body;
    review.rating = rating;
    review.comment = comment;
    if (images) review.images = images;
    
    await review.save();

    // 호텔 평점 업데이트
    const reviews = await Review.find({ hotel: review.hotel, status: 'active' });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(review.hotel, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    res.json(review);
  } catch (error) {
    console.error('Review update error:', error);
    res.status(500).json({ message: '리뷰 수정 중 오류가 발생했습니다.' });
  }
});

// 리뷰 삭제
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    // 본인 리뷰만 삭제 가능
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '리뷰를 삭제할 권한이 없습니다.' });
    }

    const hotelId = review.hotel;
    await Review.findByIdAndDelete(req.params.id);

    // 호텔 평점 업데이트
    const reviews = await Review.find({ hotel: hotelId, status: 'active' });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    } else {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: 0,
        reviewCount: 0
      });
    }

    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    console.error('Review delete error:', error);
    res.status(500).json({ message: '리뷰 삭제 중 오류가 발생했습니다.' });
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
