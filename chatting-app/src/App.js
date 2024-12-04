// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './components/ChatRoom/ChatRoom'; // 채팅방 페이지
import ChatList from './components/ChatList/ChatList'; // 채팅방 목록 페이지
import CreateRoom from './components/CreateRoom/CreateRoom'; // 채팅방 생성 페이지

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatList />} /> {/* 채팅방 목록 페이지 */}
        <Route path="/chat/:roomId" element={<ChatRoom />} /> {/* 채팅방 페이지 */}
        <Route path="/create-room" element={<CreateRoom />} /> {/* 채팅방 생성 페이지 */}
      </Routes>
    </Router>
  );
};

export default App;
