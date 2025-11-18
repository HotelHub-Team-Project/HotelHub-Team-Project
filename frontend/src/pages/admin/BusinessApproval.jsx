import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaBan } from 'react-icons/fa';

export default function BusinessApproval() {
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadBusinesses();
  }, [filter]);

  const loadBusinesses = async () => {
    try {
      const response = await api.get(`/admin/business?status=${filter}`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to load businesses:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/business/${id}/approve`);
      alert('사업자가 승인되었습니다.');
      loadBusinesses();
    } catch (error) {
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/business/${id}/reject`);
      alert('사업자가 거부되었습니다.');
      loadBusinesses();
    } catch (error) {
      alert('거부 중 오류가 발생했습니다.');
    }
  };

  const handleBlock = async (id) => {
    if (!confirm('정말 차단하시겠습니까?')) return;
    
    try {
      await api.put(`/admin/business/${id}/block`);
      alert('사업자가 차단되었습니다.');
      loadBusinesses();
    } catch (error) {
      alert('차단 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">사업자 관리</h1>

      <div className="flex space-x-4 mb-6">
        {['pending', 'approved', 'rejected', 'blocked'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status === 'pending' && '대기중'}
            {status === 'approved' && '승인됨'}
            {status === 'rejected' && '거부됨'}
            {status === 'blocked' && '차단됨'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">이름</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">이메일</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">전화번호</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">가입일</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{business.name}</td>
                <td className="px-6 py-4 text-gray-600">{business.email}</td>
                <td className="px-6 py-4 text-gray-600">{business.phone}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(business.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {business.businessStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(business._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                      >
                        <FaCheck className="mr-1" /> 승인
                      </button>
                      <button
                        onClick={() => handleReject(business._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                      >
                        <FaTimes className="mr-1" /> 거부
                      </button>
                    </div>
                  )}
                  {business.businessStatus === 'approved' && (
                    <button
                      onClick={() => handleBlock(business._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                    >
                      <FaBan className="mr-1" /> 차단
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
