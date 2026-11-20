package com.study.rental.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// study-target:dto-rental:start
// TODO: 기본 생성자, 전체 인자 생성자, 접근자와 빌더를 제공한다.
public class Rental {
    private Integer rentalId;
    private Integer equipmentId;
    private String equipmentName;
    private String loginId;
    private int days;
}
// study-target:dto-rental:end
