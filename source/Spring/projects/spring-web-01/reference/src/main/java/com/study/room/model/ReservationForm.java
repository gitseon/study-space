package com.study.room.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReservationForm {
    @NotNull(message = "방을 선택하세요")
    private Integer roomId;

    @NotBlank(message = "예약자 이름을 입력하세요")
    @Size(max = 30, message = "예약자 이름은 30자 이하입니다")
    private String memberName;

    @NotNull(message = "인원을 입력하세요")
    @Min(value = 1, message = "인원은 1명 이상입니다")
    private Integer people;

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public Integer getPeople() {
        return people;
    }

    public void setPeople(Integer people) {
        this.people = people;
    }
}
