import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartBar, FaUsers, FaHotel, FaExclamationTriangle, 
  FaTicketAlt, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: FaChartBar },
    { path: '/admin/business', label: '사업자 관리', icon: FaUsers },
    { path: '/admin/hotels', label: '호텔 관리', icon: FaHotel },
    { path: '/admin/reviews', label: '리뷰 관리', icon: FaExclamationTriangle },
    { path: '/admin/coupons', label: '쿠폰 관리', icon: FaTicketAlt },
    { path: '/admin/settings', label: '설정', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <FaCog className="text-2xl" />
            <span className="text-xl font-bold">관리자 대시보드</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-400">관리자</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-700 rounded-lg"
              title="로그아웃"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
