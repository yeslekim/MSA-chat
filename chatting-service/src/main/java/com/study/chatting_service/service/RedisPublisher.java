package com.study.chatting_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.study.chatting_service.model.Chat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RedisPublisher {


  private final RedisTemplate<String, Object> redisTemplate;
  private final ObjectMapper objectMapper;

  public RedisPublisher(RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper) {
    this.redisTemplate = redisTemplate;
    this.objectMapper = objectMapper;
  }

  public void publish(Chat chat) throws JsonProcessingException {
    String jsonMessage = objectMapper.writeValueAsString(chat);
    log.info("Publishing message to Redis: " + jsonMessage);
    redisTemplate.convertAndSend("chatroom-" + chat.getRoomId(), jsonMessage);
  }

}
