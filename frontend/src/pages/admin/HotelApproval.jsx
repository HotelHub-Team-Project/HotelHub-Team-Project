import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function HotelApproval() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await api.get('/admin/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">호텔 관리</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>호텔 승인 및 관리 페이지</p>
      </div>
    </div>
  );
}
