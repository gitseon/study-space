package com.study.room.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// study-target:dto-reservation:start
// TODO: 기본 생성자, 전체 인자 생성자, 접근자와 빌더를 제공한다.
public class Reservation {
    private Integer reservationId;
    private Integer roomId;
    private String roomName;
    private String memberName;
    private int people;
}
// study-target:dto-reservation:end
