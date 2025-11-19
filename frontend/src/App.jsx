import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// User Pages
import UserLayout from './layouts/UserLayout';
import HomePage from './pages/user/HomePage';
import SearchPage from './pages/user/SearchPage';
import HotelDetailPage from './pages/user/HotelDetailPage';
import BookingPage from './pages/user/BookingPage';
import PaymentPage from './pages/user/PaymentPage';
import PaymentSuccessPage from './pages/user/PaymentSuccessPage';
import PaymentFailPage from './pages/user/PaymentFailPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import FavoritesPage from './pages/user/FavoritesPage';

// Info Pages
import AboutPage from './pages/info/AboutPage';
import NoticePage from './pages/info/NoticePage';
import FAQPage from './pages/info/FAQPage';
import TermsPage from './pages/info/TermsPage';
import PrivacyPage from './pages/info/PrivacyPage';

// Business Pages
import BusinessLayout from './layouts/BusinessLayout';
import BusinessDashboard from './pages/business/Dashboard';
import HotelManagement from './pages/business/HotelManagement';
import RoomManagement from './pages/business/RoomManagement';
import BookingManagement from './pages/business/BookingManagement';
import ReviewManagement from './pages/business/ReviewManagement';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import BusinessApproval from './pages/admin/BusinessApproval';
import HotelApproval from './pages/admin/HotelApproval';
import ReportedReviews from './pages/admin/ReportedReviews';
import CouponManagement from './pages/admin/CouponManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="hotels/:id" element={<HotelDetailPage />} />
        <Route path="booking/:roomId" element={<BookingPage />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/fail" element={<PaymentFailPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        
        {/* Info Pages */}
        <Route path="info/about" element={<AboutPage />} />
        <Route path="info/notice" element={<NoticePage />} />
        <Route path="info/faq" element={<FAQPage />} />
        <Route path="info/terms" element={<TermsPage />} />
        <Route path="info/privacy" element={<PrivacyPage />} />
      </Route>

      {/* Business Routes */}
      <Route path="/business" element={<ProtectedRoute role="business"><BusinessLayout /></ProtectedRoute>}>
        <Route index element={<BusinessDashboard />} />
        <Route path="hotels" element={<HotelManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="business" element={<BusinessApproval />} />
        <Route path="hotels" element={<HotelApproval />} />
        <Route path="reviews" element={<ReportedReviews />} />
        <Route path="coupons" element={<CouponManagement />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}

// Protected Route Component
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">로딩중...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default App;
