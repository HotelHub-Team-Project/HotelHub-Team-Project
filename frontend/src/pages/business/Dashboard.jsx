import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaHotel, FaBed, FaCalendar, FaStar, FaChartLine } from 'react-icons/fa';

export default function BusinessDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/business/dashboard/stats'),
        api.get('/business/bookings?limit=5')
      ]);
      
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 예약</p>
              <h3 className="text-3xl font-bold text-indigo-600">
                {stats?.totalBookings || 15}
              </h3>
              <p className="text-sm text-gray-500 mt-1">오늘 3건</p>
            </div>
            <div className="p-4 bg-indigo-100 rounded-full">
              <FaCalendar className="text-2xl text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 매출</p>
              <h3 className="text-3xl font-bold text-green-600">
                ₩{(stats?.totalRevenue || 12500000).toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-1">이번 달</p>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <FaChartLine className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">호텔 관리</p>
              <h3 className="text-3xl font-bold text-purple-600">
                {stats?.totalHotels || 45}
              </h3>
              <p className="text-sm text-gray-500 mt-1">오늘 기준</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-full">
              <FaHotel className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">리뷰 관리</p>
              <h3 className="text-3xl font-bold text-yellow-600">
                {stats?.totalReviews || 8}
              </h3>
              <p className="text-sm text-gray-500 mt-1">대기 중</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <FaStar className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">매출 추이</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-600">차트가 여기에 표시됩니다</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">최근 예약</h2>
          <button className="text-indigo-600 hover:text-indigo-700">전체보기</button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">예약번호</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">호텔명</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">고객명</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">체크인</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">금액</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentBookings.map((booking, idx) => (
              <tr key={booking._id || idx} className="hover:bg-gray-50">
                <td className="px-4 py-3">#{booking._id?.slice(-6) || 'BK001'}</td>
                <td className="px-4 py-3">{booking.hotel?.name || '서울 그랜드 호텔'}</td>
                <td className="px-4 py-3">{booking.user?.name || '홍길동'}</td>
                <td className="px-4 py-3">
                  {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '2025-12-01'}
                </td>
                <td className="px-4 py-3 font-semibold">
                  ₩{(booking.finalPrice || 200000).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.bookingStatus === 'confirmed' || !booking.bookingStatus
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.bookingStatus === 'confirmed' || !booking.bookingStatus ? '확정' : '취소'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-700 mr-3">보기</button>
                  <button className="text-red-600 hover:text-red-700">취소</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
