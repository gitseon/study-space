package com.study.rental.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @@target dto-rental
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
// @@stage 1
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
// @@stage 2
// TODO: 기본 생성자, 전체 인자 생성자, 접근자와 빌더를 제공한다.
public class Rental {
    private Integer rentalId;
    private Integer equipmentId;
    private String equipmentName;
    private String loginId;
    private int days;
}
// @@stage 3
public class Rental {
    // TODO: 요구사항의 필드와 Lombok으로 만드는 생성자, 접근자, 빌더를 작성한다.
}
// @@end
