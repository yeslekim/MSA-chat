// CreateRoom.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      console.log(roomName)
      // POST 요청을 보내는 부분
      const response = await fetch('http://localhost:8080/chat/room?roomName=' + roomName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 채팅방 생성 후, 해당 채팅방으로 이동
        navigate(`/chat/${roomName}`);
      } else {
        // 실패 처리
        alert('채팅방 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
      alert('채팅방 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="create-room">
      <h2>채팅방 생성</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="채팅방 이름을 입력하세요"
      />
      <button onClick={handleCreateRoom}>생성</button>
    </div>
  );
};

export default CreateRoom;
