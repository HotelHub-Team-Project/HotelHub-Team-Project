const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Toss Payments 결제 승인
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    // Toss Payments API 호출
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      { paymentKey, orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 예약 정보 업데이트
    const booking = await Booking.findOne({ tossOrderId: orderId });
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.tossPaymentKey = paymentKey;
      booking.paymentMethod = response.data.method;
      await booking.save();

      // 포인트 적립 (결제 금액의 1%)
      const earnedPoints = Math.floor(amount * 0.01);
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: earnedPoints }
      });
    }

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '결제 승인 중 오류가 발생했습니다.',
      error: error.response?.data || error.message
    });
  }
});

// 결제 취소 (환불)
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { paymentKey, cancelReason } = req.body;

    const response = await axios.post(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      { cancelReason },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 예약 정보 업데이트
    const booking = await Booking.findOne({ tossPaymentKey: paymentKey });
    if (booking) {
      booking.paymentStatus = 'refunded';
      await booking.save();
    }

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '결제 취소 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;
