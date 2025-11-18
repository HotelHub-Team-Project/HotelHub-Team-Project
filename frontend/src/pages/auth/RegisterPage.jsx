import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHotel, FaUser, FaEnvelope, FaLock, FaPhone, FaExclamationCircle, FaCheckCircle, FaBriefcase } from 'react-icons/fa';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      });

      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    if (password.length < 6) return { text: '약함', color: 'text-red-500', bg: 'bg-red-500' };
    if (password.length < 10) return { text: '보통', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { text: '강함', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-600 via-sage-500 to-emerald-600 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-sage-600 to-sage-500 px-8 py-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white mb-3">
            <FaHotel className="text-4xl" />
            <span className="text-3xl font-bold">HotelHub</span>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-3">회원가입</h2>
          <p className="mt-2 text-sage-50">새 계정을 만들어 다양한 혜택을 누리세요</p>
        </div>

        {/* Register Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                <FaExclamationCircle className="text-xl mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Grid Layout for better organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="010-1234-5678"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="최소 6자 이상"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                  />
                </div>
                {strength && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.bg} transition-all`} style={{width: strength.text === '약함' ? '33%' : strength.text === '보통' ? '66%' : '100%'}}></div>
                    </div>
                    <span className={`text-xs font-medium ${strength.color}`}>{strength.text}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="비밀번호 재입력"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all outline-none"
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <FaCheckCircle className="absolute right-4 top-3.5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                회원 유형 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'user'})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'user'
                      ? 'border-sage-500 bg-sage-50 shadow-md'
                      : 'border-gray-200 hover:border-sage-300'
                  }`}
                >
                  <FaUser className={`text-2xl mx-auto mb-2 ${formData.role === 'user' ? 'text-sage-600' : 'text-gray-400'}`} />
                  <p className="font-semibold text-gray-900">일반 사용자</p>
                  <p className="text-xs text-gray-500 mt-1">호텔 검색 및 예약</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'business'})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'business'
                      ? 'border-sage-500 bg-sage-50 shadow-md'
                      : 'border-gray-200 hover:border-sage-300'
                  }`}
                >
                  <FaBriefcase className={`text-2xl mx-auto mb-2 ${formData.role === 'business' ? 'text-sage-600' : 'text-gray-400'}`} />
                  <p className="font-semibold text-gray-900">사업자</p>
                  <p className="text-xs text-gray-500 mt-1">호텔 등록 및 관리</p>
                </button>
              </div>
              
              {formData.role === 'business' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-start">
                    <FaExclamationCircle className="mt-0.5 mr-2 flex-shrink-0" />
                    <span>사업자 회원은 관리자 승인 후 호텔 등록이 가능합니다.</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sage-600 to-sage-500 text-white rounded-lg hover:from-sage-700 hover:to-sage-600 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '가입 처리 중...' : '회원가입 완료'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-bold text-sage-600 hover:text-sage-700 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
