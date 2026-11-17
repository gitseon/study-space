package com.study.rental.exception;

public class RentalNotFoundException extends NotFoundException {
    public RentalNotFoundException(int rentalId) {
        super("대여 " + rentalId + "번을 찾을 수 없습니다");
    }
}
