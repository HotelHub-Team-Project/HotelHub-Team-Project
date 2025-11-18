const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { authenticate, authorize } = require('../middleware/auth');

// 쿠폰 목록
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      status: 'active',
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 코드로 조회
router.get('/code/:code', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase(),
      status: 'active',
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: '유효하지 않은 쿠폰입니다.' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 조회 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 생성 (관리자)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const coupon = new Coupon({
      ...req.body,
      createdBy: req.user._id
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 생성 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 수정 (관리자)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 수정 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 삭제 (관리자)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ message: '쿠폰이 비활성화되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '쿠폰 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
