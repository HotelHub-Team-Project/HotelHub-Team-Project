const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Hotel = require('../models/Hotel');
const { authenticate } = require('../middleware/auth');

// 내 찜 목록
router.get('/my', authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'hotel',
        populate: { path: 'owner', select: 'name' }
      })
      .sort('-createdAt');

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: '찜 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 찜 추가
router.post('/', authenticate, async (req, res) => {
  try {
    const { hotelId } = req.body;

    // 이미 찜했는지 확인
    const existing = await Favorite.findOne({ 
      user: req.user._id, 
      hotel: hotelId 
    });

    if (existing) {
      return res.status(400).json({ message: '이미 찜한 호텔입니다.' });
    }

    const favorite = new Favorite({
      user: req.user._id,
      hotel: hotelId
    });

    await favorite.save();
    await favorite.populate('hotel');

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: '찜 추가 중 오류가 발생했습니다.' });
  }
});

// 찜 삭제
router.delete('/:hotelId', authenticate, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      hotel: req.params.hotelId
    });

    res.json({ message: '찜이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '찜 삭제 중 오류가 발생했습니다.' });
  }
});

// 가격 알림 설정
router.put('/:hotelId/price-alert', authenticate, async (req, res) => {
  try {
    const { enabled, targetPrice } = req.body;

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user._id, hotel: req.params.hotelId },
      {
        'priceAlert.enabled': enabled,
        'priceAlert.targetPrice': targetPrice
      },
      { new: true }
    ).populate('hotel');

    if (!favorite) {
      return res.status(404).json({ message: '찜을 찾을 수 없습니다.' });
    }

    res.json({ message: '가격 알림이 설정되었습니다.', favorite });
  } catch (error) {
    console.error('Price alert error:', error);
    res.status(500).json({ message: '가격 알림 설정 중 오류가 발생했습니다.' });
  }
});

// 가격 알림 확인 (스케줄러용)
router.get('/check-price-alerts', async (req, res) => {
  try {
    const favorites = await Favorite.find({
      'priceAlert.enabled': true
    }).populate('hotel');

    const alerts = [];

    for (const favorite of favorites) {
      if (!favorite.hotel) continue;

      // 호텔의 최저가 객실 찾기
      const Room = require('../models/Room');
      const cheapestRoom = await Room.findOne({ 
        hotel: favorite.hotel._id,
        availableRooms: { $gt: 0 }
      }).sort('price');

      if (cheapestRoom && cheapestRoom.price <= favorite.priceAlert.targetPrice) {
        const lastNotified = favorite.priceAlert.lastNotified;
        const hoursSinceLastNotified = lastNotified 
          ? (Date.now() - lastNotified.getTime()) / (1000 * 60 * 60)
          : 999;

        // 24시간에 한 번만 알림
        if (hoursSinceLastNotified >= 24) {
          alerts.push({
            userId: favorite.user,
            hotelId: favorite.hotel._id,
            hotelName: favorite.hotel.name,
            currentPrice: cheapestRoom.price,
            targetPrice: favorite.priceAlert.targetPrice
          });

          // 알림 시간 업데이트
          favorite.priceAlert.lastNotified = new Date();
          await favorite.save();
        }
      }
    }

    res.json({ alerts });
  } catch (error) {
    console.error('Check price alerts error:', error);
    res.status(500).json({ message: '가격 알림 확인 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
