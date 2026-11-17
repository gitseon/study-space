package com.study.rental.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RentalRequest(
        @NotNull(message = "장비를 선택하세요") Integer equipmentId,
        @NotNull(message = "대여 일수를 입력하세요") @Min(value = 1, message = "대여 일수는 1일 이상입니다") @Max(value = 14, message = "대여 일수는 14일 이하입니다") Integer days) {
}
