package com.study.room.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @@target dto-reservation
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    private Integer reservationId;
    private Integer roomId;
    private String roomName;
    private String memberName;
    private int people;
}
// @@stage 1
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
// @@stage 2
// TODO: 기본 생성자, 전체 인자 생성자, 접근자와 빌더를 제공한다.
public class Reservation {
    private Integer reservationId;
    private Integer roomId;
    private String roomName;
    private String memberName;
    private int people;
}
// @@stage 3
public class Reservation {
    // TODO: 요구사항의 필드와 Lombok으로 만드는 생성자, 접근자, 빌더를 작성한다.
}
// @@end
