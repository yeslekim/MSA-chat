package com.study.chatting_service.model;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

  /** websocket을 통해 들어온 요청이 처리 되기전 실행된다.*/
  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

//    // 헤더에서 Authorization 정보를 추출
//    String token = accessor.getFirstNativeHeader("Authorization");
//
//    if (token == null || !isValidToken(token)) {
//      throw new RuntimeException("Unauthorized");
//    }

    return message;
  }

  private boolean isValidToken(String token) {
    // 토큰 검증 로직 구현 (예: JWT 토큰 검증)
    return true; // 예시: 항상 true를 반환 (실제 구현은 토큰 검증 로직을 작성해야 함)
  }
}
