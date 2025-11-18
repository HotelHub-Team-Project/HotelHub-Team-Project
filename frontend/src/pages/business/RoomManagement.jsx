import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await api.get('/business/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">객실 관리</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>객실 관리 페이지</p>
      </div>
    </div>
  );
}
