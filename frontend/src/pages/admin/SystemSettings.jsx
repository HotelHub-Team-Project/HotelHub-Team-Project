import { useState } from 'react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'HotelHub',
    siteEmail: 'admin@hotelhub.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true
  });

  const handleSave = () => {
    alert('설정이 저장되었습니다.');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">시스템 설정</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">사이트 설정</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">사이트 이름</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">관리자 이메일</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
            />
            <label className="text-sm">유지보수 모드</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
            />
            <label className="text-sm">회원 가입 허용</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
            />
            <label className="text-sm">이메일 알림</label>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
