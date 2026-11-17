package com.study.room.exception;

public class RoomFullException extends RuntimeException {
    public RoomFullException(String roomName, int remaining) {
        super(roomName + "의 남은 자리는 " + remaining + "명입니다");
    }
}
