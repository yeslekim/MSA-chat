// ChatList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './ChatList.css';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/chat/rooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        } else {
          console.error('Failed to fetch chat rooms');
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (userId) => {
    setIsModalOpen(false);
    if (userId) {
      navigate(`/chat/${selectedRoom}?userId=${userId}`);
    }
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>채팅</h2>
      </div>
      <ul className="chat-list">
        {rooms.map((room) => (
          <li key={room} className="chat-list-item" onClick={() => handleRoomClick(room)}>
            <div className="room-link">
              <div className="room-item">
                <h4 className="room-title">채팅방 {room}</h4>
                <p className="room-subtitle">최근 메시지</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <button className="create-room-button">채팅방 만들기</button>
    </div>
  );
};

export default ChatList;
