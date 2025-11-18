import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHotel, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { SiKakao } from 'react-icons/si';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('로그인 시도:', formData.email);
      const user = await login(formData.email, formData.password);
      console.log('로그인 성공:', user);
      
      // 역할에 따라 리다이렉트
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'business') {
        navigate('/business');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-600 via-sage-500 to-emerald-600 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-8 py-10 text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white mb-4">
            <FaHotel className="text-4xl" />
            <span className="text-3xl font-bold">HotelHub</span>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-4">로그인</h2>
          <p className="mt-2 text-sage-50">계정에 로그인하세요</p>
        </div>

        {/* Login Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                <FaExclamationCircle className="text-xl mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="happysun0142@gmail.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500" />
                <span className="text-gray-600">로그인 상태 유지</span>
              </label>
              <Link to="/forgot-password" className="text-sage-600 hover:text-sage-700 font-medium">
                비밀번호 찾기
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sage-600 to-sage-500 text-white rounded-lg hover:from-sage-700 hover:to-sage-600 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">간편 로그인</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleKakaoLogin}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 bg-[#FEE500] text-[#000000] rounded-lg hover:bg-[#FFEB3B] font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <SiKakao className="text-2xl" />
                <span>카카오로 로그인</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <Link to="/register" className="font-bold text-sage-600 hover:text-sage-700 hover:underline">
                회원가입
              </Link>
            </p>
          </div>

          {/* Test Accounts Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">🔐 테스트 계정</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👤 일반 사용자: test2@gmail.com / 123456</p>
              <p>🏢 사업자: test1@gmail.com / 123456</p>
              <p>🛠️ 관리자: admin@test.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
