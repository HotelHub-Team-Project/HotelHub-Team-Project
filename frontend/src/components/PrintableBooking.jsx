import { FaPrint, FaCalendar, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function PrintableBooking({ booking }) {
  const handlePrint = () => {
    window.print();
  };

  if (!booking) return null;

  return (
    <>
      {/* 인쇄 버튼 - 화면에만 표시 */}
      <button
        onClick={handlePrint}
        className="print:hidden mb-4 px-6 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 flex items-center space-x-2"
      >
        <FaPrint />
        <span>예약 확인서 인쇄</span>
      </button>

      {/* 인쇄용 컨텐츠 */}
      <div className="bg-white p-8 rounded-lg shadow-md print:shadow-none">
        {/* 헤더 */}
        <div className="border-b-2 border-sage-600 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">HotelHub 예약 확인서</h1>
          <p className="text-gray-600">Booking Confirmation</p>
          <div className="mt-4 bg-sage-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">예약 번호 / Booking Number</div>
            <div className="text-2xl font-bold text-sage-800">{booking._id?.slice(-8).toUpperCase()}</div>
          </div>
        </div>

        {/* 예약 정보 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-sage-800">호텔 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">호텔명</div>
                <div className="font-semibold text-lg">{booking.room?.hotel?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> 주소
                </div>
                <div>{booking.room?.hotel?.location?.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">객실 정보</div>
                <div className="font-semibold">{booking.room?.name}</div>
                <div className="text-sm text-gray-600">{booking.room?.type}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-sage-800">투숙객 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaUser className="mr-1" /> 예약자명
                </div>
                <div className="font-semibold">{booking.user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaPhone className="mr-1" /> 연락처
                </div>
                <div>{booking.user?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaEnvelope className="mr-1" /> 이메일
                </div>
                <div>{booking.user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 숙박 일정 */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-sage-800 flex items-center">
            <FaCalendar className="mr-2" /> 숙박 일정
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">체크인</div>
              <div className="font-bold text-lg">{new Date(booking.checkIn).toLocaleDateString('ko-KR')}</div>
              <div className="text-sm text-gray-600">15:00 이후</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">체크아웃</div>
              <div className="font-bold text-lg">{new Date(booking.checkOut).toLocaleDateString('ko-KR')}</div>
              <div className="text-sm text-gray-600">11:00 이전</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">숙박 일수</div>
              <div className="font-bold text-lg">
                {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}박
              </div>
              <div className="text-sm text-gray-600">
                성인 {booking.guests?.adults || 0}명, 아동 {booking.guests?.children || 0}명
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="border-t-2 border-gray-200 pt-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-sage-800">결제 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>객실 요금</span>
              <span>₩{booking.totalPrice?.toLocaleString()}</span>
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>할인</span>
                <span>-₩{booking.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl pt-4 border-t-2">
              <span>총 결제 금액</span>
              <span className="text-sage-600">₩{(booking.totalPrice - (booking.discount || 0)).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600">
              결제 방법: {booking.paymentMethod === 'card' ? '카드 결제' : '현장 결제'}
            </div>
          </div>
        </div>

        {/* 특별 요청사항 */}
        {booking.specialRequests && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-sage-800">특별 요청사항</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {booking.specialRequests}
            </div>
          </div>
        )}

        {/* 안내사항 */}
        <div className="border-t-2 border-gray-200 pt-6 text-sm text-gray-600">
          <h3 className="font-bold mb-2">안내사항</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>체크인 시 예약 확인서와 신분증을 제시해주세요.</li>
            <li>숙박 요금은 세금 및 봉사료가 포함된 금액입니다.</li>
            <li>예약 변경 및 취소는 HotelHub 웹사이트에서 가능합니다.</li>
            <li>체크인 시간 전 도착하시는 경우 짐 보관 서비스를 이용하실 수 있습니다.</li>
          </ul>
        </div>

        {/* 푸터 */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-600">
          <p>문의사항: help@hotelhub.com | 고객센터: 1588-0000</p>
          <p className="mt-2">© 2025 HotelHub. All rights reserved.</p>
          <p className="mt-4 text-xs">발행일: {new Date().toLocaleString('ko-KR')}</p>
        </div>
      </div>

      {/* 인쇄용 CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 2cm;
          }
        }
      `}</style>
    </>
  );
}
