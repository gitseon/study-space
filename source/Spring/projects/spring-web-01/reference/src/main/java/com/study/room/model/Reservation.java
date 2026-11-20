package com.study.room.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
