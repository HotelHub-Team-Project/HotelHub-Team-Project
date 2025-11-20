const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// 예약 생성
router.post('/', authenticate, async (req, res) => {
  try {
    const { hotel, room, checkIn, checkOut, guests, usedCoupons, usedPoints, specialRequests, totalPrice, finalPrice } = req.body;

    // 객실 확인
    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData || roomData.availableRooms < 1) {
      return res.status(400).json({ message: '예약 가능한 객실이 없습니다.' });
    }

    // 날짜 유효성 검사
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: '체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.' });
    }

    // 가격 계산 (프론트엔드에서 전달받거나 재계산)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedPrice = totalPrice || (roomData.price * nights);
    const calculatedFinal = finalPrice || calculatedPrice;

    // 예약 생성
    const booking = new Booking({
      user: req.user._id,
      hotel: hotel || roomData.hotel._id,
      room: room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 2, children: 0 },
      totalPrice: calculatedPrice,
      discountAmount: usedPoints || 0,
      finalPrice: calculatedFinal,
      usedCoupons: usedCoupons || [],
      usedPoints: usedPoints || 0,
      specialRequests: specialRequests || '',
      tossOrderId: `ORDER_${Date.now()}_${req.user._id}`
    });

    await booking.save();

    // 객실 재고 감소
    roomData.availableRooms -= 1;
    await roomData.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: '예약 생성 중 오류가 발생했습니다.', error: error.message });
  }
});

// 내 예약 목록
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name images location')
      .populate('room', 'name type')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 예약 상세
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: '예약 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 예약 취소
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    // 예약 상태 변경
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // 객실 재고 복구
    const room = await Room.findById(booking.room);
    room.availableRooms += 1;
    await room.save();

    // 포인트 환불
    if (booking.usedPoints > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: booking.usedPoints }
      });
    }

    res.json({ message: '예약이 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예약 취소 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
