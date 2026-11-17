package com.study.rental.exception;

public class RentalConflictException extends RuntimeException {
    public RentalConflictException(String equipmentName) {
        super(equipmentName + "은(는) 이미 대여 중입니다");
    }
}
