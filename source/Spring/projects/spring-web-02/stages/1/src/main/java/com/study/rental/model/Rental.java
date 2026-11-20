package com.study.rental.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// study-target:dto-rental:start
@Getter
@Setter
@NoArgsConstructor
// TODO: 전체 인자 생성자와 빌더를 추가한다.
public class Rental {
    private Integer rentalId;
    private Integer equipmentId;
    private String equipmentName;
    private String loginId;
    private int days;
}
// study-target:dto-rental:end
