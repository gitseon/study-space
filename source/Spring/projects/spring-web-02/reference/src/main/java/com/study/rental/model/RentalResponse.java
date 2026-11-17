package com.study.rental.model;

public record RentalResponse(int rentalId, int equipmentId, String equipmentName, String loginId, int days) {
    public static RentalResponse from(Rental rental) {
        return new RentalResponse(rental.getRentalId(), rental.getEquipmentId(), rental.getEquipmentName(), rental.getLoginId(), rental.getDays());
    }
}
