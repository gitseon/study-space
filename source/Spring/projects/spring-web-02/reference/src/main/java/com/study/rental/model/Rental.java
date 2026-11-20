package com.study.rental.model;

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
public class Rental {
    private Integer rentalId;
    private Integer equipmentId;
    private String equipmentName;
    private String loginId;
    private int days;
}
