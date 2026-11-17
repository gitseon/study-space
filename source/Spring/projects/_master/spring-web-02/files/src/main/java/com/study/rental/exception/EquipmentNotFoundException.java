package com.study.rental.exception;

public class EquipmentNotFoundException extends NotFoundException {
    public EquipmentNotFoundException(int equipmentId) {
        super("장비 " + equipmentId + "번을 찾을 수 없습니다");
    }
}
