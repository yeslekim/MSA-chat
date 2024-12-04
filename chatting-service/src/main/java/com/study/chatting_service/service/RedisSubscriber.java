package com.study.chatting_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.study.chatting_service.model.Chat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RedisSubscriber implements MessageListener {

  private final SimpMessagingTemplate messagingTemplate;
  private final ObjectMapper objectMapper;

  public RedisSubscriber(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
    this.messagingTemplate = messagingTemplate;
    this.objectMapper = objectMapper;
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {

    try {
      String messageBody = objectMapper.readTree(message.getBody()).asText();
      // 메시지를 Chat 객체로 역직렬화
      Chat chat = objectMapper.readValue(messageBody, Chat.class);

      // 채팅방 ID, 사용자 ID, 메시지 추출
      String roomId = chat.getRoomId();  // Redis 채널에서 채팅방 ID 추출

      // 로그 출력
      log.info("Received message from roomID: {}, userId: {}, message: {}", roomId,
          chat.getUserId(), chat.getMessage());

      // 클라이언트에게 메시지 전달
      messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, messageBody);

    } catch (Exception e) {
      log.error("Error processing message from Redis", e);
    }
  }

}
