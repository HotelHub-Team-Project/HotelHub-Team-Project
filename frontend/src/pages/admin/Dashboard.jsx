import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaUsers, FaHotel, FaCalendar, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 예약</p>
              <h3 className="text-3xl font-bold text-indigo-600">
                {stats?.totalBookings || 15}
              </h3>
            </div>
            <FaCalendar className="text-4xl text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 매출</p>
              <h3 className="text-3xl font-bold text-green-600">
                ₩{(stats?.totalRevenue || 12500000).toLocaleString()}
              </h3>
            </div>
            <FaChartLine className="text-4xl text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">사업자 수</p>
              <h3 className="text-3xl font-bold text-purple-600">
                {stats?.totalBusiness || 45}
              </h3>
            </div>
            <FaUsers className="text-4xl text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">호텔 수</p>
              <h3 className="text-3xl font-bold text-yellow-600">
                {stats?.totalHotels || 8}
              </h3>
            </div>
            <FaHotel className="text-4xl text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
