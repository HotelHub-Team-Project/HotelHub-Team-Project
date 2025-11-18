import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                      <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">내 예약</Link>
                      <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100">찜 목록</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-sage-600">로그인</Link>
                  <Link to="/register" className="btn-primary">회원가입</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sage-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Go Anywhere</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Careers</li>
                <li>Investors</li>
                <li>Affiliate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Our Activities</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Guarantee</li>
                <li>Legal Information</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Travel Blog</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Bali Travel Guide</li>
                <li>Sri Lankan Travel Guide</li>
                <li>Peru Travel Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Our Story</li>
                <li>Work with us</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-sage-700 text-center text-sm text-gray-300">
            <p>© 2025 HotelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
