package com.study.chatting_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.study.chatting_service.model.Chat;
import com.study.chatting_service.service.ChatService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@Slf4j
public class ChatController {

  private final ChatService chatService;

  @PostMapping("/chat/room")
  public ResponseEntity<String> createRoom(@RequestParam String roomId) {
    chatService.createChatRoom(roomId);
    return ResponseEntity.ok("채팅방이 생성되었습니다.");
  }

  @GetMapping("/chat/rooms")
  public List<String> getAllRooms() {
    return chatService.findAllRooms();
  }

  @GetMapping("/chat/read")
  public List<Object> getRoomMessages(@RequestParam String roomId) {
    return chatService.loadMessage(roomId);
  }

  /**
   * websocket "/pub/chat/message"로 들어오는 메시징을 처리한다.
   */
  @MessageMapping("/chat/message")
  public void message(@Payload Chat chat) {
    try {
      log.info("Received message: " + chat);
      chatService.sendChatMessage(chat); // RedisPublisher 호출
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }

}
