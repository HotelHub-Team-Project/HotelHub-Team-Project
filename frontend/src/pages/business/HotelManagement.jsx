import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/business/hotels/${id}`);
      alert('호텔이 삭제되었습니다.');
      loadHotels();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">호텔 관리</h1>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
          <FaPlus />
          <span>호텔 추가</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔명</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">위치</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">평점</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{hotel.name}</td>
                <td className="px-6 py-4 text-gray-600">{hotel.location?.city || '부산'}</td>
                <td className="px-6 py-4">
                  <span className="text-yellow-500 font-semibold">
                    ⭐ {hotel.rating?.toFixed(1) || '4.2'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hotel.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {hotel.status === 'active' ? '활성' : '대기중'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-700 mr-4">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
