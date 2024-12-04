import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { format } from 'date-fns';
import './ChatRoom.css';

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate ();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [userId, setUserId] = useState('');

  const messagesEndRef = useRef(null); // 메시지 목록의 끝을 참조하는 ref

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const userIdFromQuery = query.get('userId');
    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    } else {
      alert('User ID is required to enter the chat room.');
      navigate('/');
    }

    // 웹소켓 연결
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const client = Stomp.over(socket);

    client.connect(
      { Authorization: `Bearer 1234` }, 
      () => {
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const incomingMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [
            ...prevMessages,
            { userId: incomingMessage.userId, message: incomingMessage.message, sendDt: incomingMessage.sendDt },
          ]);
        });
      }, (error) => {
        console.error('Error with WebSocket connection', error);
      }
    );

    setStompClient(client);

    return () => {
      client.disconnect();
    };
  }, [roomId, location.search, navigate]);

  useEffect(() => {
    // 기존 대화 이력 불러오기
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/chat/read?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [roomId]);

  const sendMessage = () => {        
    if (stompClient) {
      stompClient.send(
        '/pub/chat/message',
        {}, 
        JSON.stringify({ roomId: roomId, userId: userId, message: newMessage })
      );
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const exitChatRoom = () => {
    navigate('/');
  };

  // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // messages가 변경될 때마다 실행

  return (
    <div className="chat-room">      
      <div className="chat-header">
        <h2>{roomId} 채팅방</h2>
        <button className="exit-button" onClick={exitChatRoom}>나가기</button>
      </div>
      <div className="chat-body">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.userId === userId ? 'my-message' : 'other-message'}`}
            >
              <div className="message-user">
                <img
                  className="message-user-avatar"
                  src={`https://img2.quasarzone.com/editor/2023/09/16/48657e5145637aa66b5ac791e17f72c0.png`} // 임시 아바타
                  alt={`${msg.userId}'s avatar`}
                />
                <div className="message-content-wrapper">
                  <div className="message-user-id">{msg.userId}</div>
                  <div className="message-content">{msg.message}</div>
                  <div className="message-timestamp">{format(new Date(msg.sendDt), 'yyyy-MM-dd HH:mm')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 메시지 목록 끝에 위치시키기 위해 추가 */}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </div>
  );
};

export default ChatRoom;
