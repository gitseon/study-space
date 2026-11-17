package com.study.room.exception;

public class ReservationNotFoundException extends RuntimeException {
    public ReservationNotFoundException(int reservationId) {
        super("예약 " + reservationId + "번을 찾을 수 없습니다");
    }
}
