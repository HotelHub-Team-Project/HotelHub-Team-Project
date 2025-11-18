import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/business/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">예약 관리</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>예약 관리 페이지</p>
      </div>
    </div>
  );
}
