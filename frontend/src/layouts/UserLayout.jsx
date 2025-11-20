import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaHeart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Footer from '../components/Footer';

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <FaHotel className="text-sage-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">HotelHub</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link to="/search" className="text-gray-700 hover:text-sage-600">호텔 검색</Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                      관리자 대시보드
                    </Link>
                  )}
                  {user.role === 'business' && (
                    <Link to="/business" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                      사업자 대시보드
                    </Link>
                  )}
                  <Link to="/dashboard" className="text-gray-700 hover:text-sage-600">대시보드</Link>
                  <Link to="/my-bookings" className="text-gray-700 hover:text-sage-600">예약 내역</Link>
                  <Link to="/favorites" className="flex items-center space-x-1 text-gray-700 hover:text-sage-600">
                    <FaHeart />
                    <span>찜</span>
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-sage-600">
                      <FaUser />
                      <span>{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                      <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">대시보드</Link>
                      <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">내 예약</Link>
                      <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100">찜 목록</Link>
                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                        <FaCog />
                        <span>설정</span>
                      </Link>
                      <hr className="my-2" />
                      <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                        <FaSignOutAlt />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-sage-600">로그인</Link>
                  <Link to="/register" className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700">회원가입</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
