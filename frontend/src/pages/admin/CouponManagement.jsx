import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">쿠폰 관리</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>쿠폰 생성 및 관리 페이지</p>
      </div>
    </div>
  );
}
