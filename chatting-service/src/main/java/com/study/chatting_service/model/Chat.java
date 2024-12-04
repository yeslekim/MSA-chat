package com.study.chatting_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import lombok.Data;


@Data
public class Chat {

  @JsonProperty("roomId")
  private String roomId;      // 방 번호
  @JsonProperty("userId")
  private String userId;      // 사용자 id
  @JsonProperty("message")
  private String message;     // 메시지
  @JsonProperty(required = false)
  private Date sendDt;       // 보낸시간

}