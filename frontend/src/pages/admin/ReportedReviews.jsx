import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function ReportedReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await api.get('/admin/reviews/reported');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">리뷰 관리</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>신고된 리뷰 관리 페이지</p>
      </div>
    </div>
  );
}
