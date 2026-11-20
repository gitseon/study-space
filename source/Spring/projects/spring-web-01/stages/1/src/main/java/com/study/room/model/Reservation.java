package com.study.room.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// study-target:dto-reservation:start
@Getter
@Setter
@NoArgsConstructor
// TODO: 전체 인자 생성자와 빌더를 추가한다.
public class Reservation {
    private Integer reservationId;
    private Integer roomId;
    private String roomName;
    private String memberName;
    private int people;
}
// study-target:dto-reservation:end
