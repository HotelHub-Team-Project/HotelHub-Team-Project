import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaEye, FaStar } from 'react-icons/fa';

export default function ReportedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reviews/reported');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      alert('신고된 리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedReview(null);
  };

  const handleApprove = async (reviewId) => {
    if (!confirm('이 신고를 승인하고 리뷰를 숨기시겠습니까?')) return;

    try {
      await api.put(`/admin/reviews/${reviewId}/approve`);
      alert('리뷰가 숨김 처리되었습니다.');
      loadReviews();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to approve report:', error);
      alert('리뷰 숨김 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (reviewId) => {
    if (!confirm('이 신고를 거부하시겠습니까?')) return;

    try {
      await api.put(`/admin/reviews/${reviewId}/reject`);
      alert('신고가 거부되었습니다.');
      loadReviews();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to reject report:', error);
      alert('신고 거부 중 오류가 발생했습니다.');
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
      <h1 className="text-3xl font-bold mb-8">신고된 리뷰 관리</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">신고 대기</p>
          <h3 className="text-3xl font-bold text-yellow-600">{reviews.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">오늘 신고</p>
          <h3 className="text-3xl font-bold text-red-600">
            {reviews.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">처리 필요</p>
          <h3 className="text-3xl font-bold text-indigo-600">
            {reviews.filter(r => r.reportStatus === 'pending').length}
          </h3>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">신고된 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">리뷰 내용</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작성자</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">신고자</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">신고일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          size={14}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{review.hotel?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{review.user?.name}</div>
                    <div className="text-sm text-gray-500">{review.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{review.reportedBy?.name || '익명'}</div>
                    <div className="text-sm text-gray-500">{review.reportReason || '사유 없음'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(review)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="상세보기"
                      >
                        <FaEye size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-sm"
                      >
                        <FaCheck className="mr-1" /> 숨김
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center text-sm"
                      >
                        <FaTimes className="mr-1" /> 거부
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 리뷰 상세 모달 */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">리뷰 상세 정보</h2>
              <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 리뷰 내용 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">리뷰 내용</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}
                        size={20}
                      />
                    ))}
                    <span className="ml-2 font-semibold">{selectedReview.rating}점</span>
                  </div>
                  <p className="text-gray-700">{selectedReview.comment}</p>
                  <p className="text-sm text-gray-500">
                    작성일: {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 호텔 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">호텔 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-lg">{selectedReview.hotel?.name}</p>
                  <p className="text-sm text-gray-600">{selectedReview.hotel?.location?.city}</p>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">작성자 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">이름:</span> <span className="font-semibold">{selectedReview.user?.name}</span></p>
                  <p><span className="text-gray-600">이메일:</span> <span className="font-semibold">{selectedReview.user?.email}</span></p>
                </div>
              </div>

              {/* 신고 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">신고 정보</h3>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">신고자:</span> <span className="font-semibold">{selectedReview.reportedBy?.name || '익명'}</span></p>
                  <p><span className="text-gray-600">신고 사유:</span> <span className="font-semibold">{selectedReview.reportReason || '사유 없음'}</span></p>
                  <p><span className="text-gray-600">신고일:</span> <span className="font-semibold">{new Date(selectedReview.createdAt).toLocaleString()}</span></p>
                </div>
              </div>

              {/* 작업 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => handleApprove(selectedReview._id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                >
                  <FaCheck className="mr-2" /> 리뷰 숨기기
                </button>
                <button
                  onClick={() => handleReject(selectedReview._id)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                >
                  <FaTimes className="mr-2" /> 신고 거부
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
