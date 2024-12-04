package com.study.chatting_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.study.chatting_service.model.Chat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class ChatService {

  private final RedisPublisher redisPublisher;
  private final RedisTemplate<String, Object> redisTemplate;
  private final ObjectMapper objectMapper;


  /**
   * 채팅방에 메시지 발송
   */
  public void sendChatMessage(Chat chatChat) throws JsonProcessingException {
    saveChatMessage(chatChat);

    // 채팅창에 전송
    redisPublisher.publish(chatChat);
  }

  private void saveChatMessage(Chat chatChat) {
    chatChat.setSendDt(new Date()); // 전송 시간 현재시간으로 저장
    redisTemplate.opsForList().rightPush(chatChat.getRoomId(), chatChat);
  }

  public List<Object> loadMessage(String roomId) {
    return redisTemplate.opsForList().range(roomId, 0, 99);
  }

  public void createChatRoom(String roomName) {
    // 채팅방 이름을 Redis에 저장
    redisTemplate.opsForHash().put("CHAT_ROOMS", roomName, roomName);
  }

  public List<String> findAllRooms() {
    // Redis에서 모든 채팅방 이름을 조회
    return redisTemplate.opsForHash().keys("CHAT_ROOMS").stream()
        .map(Object::toString)
        .collect(Collectors.toList());
  }

}
