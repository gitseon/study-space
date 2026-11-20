package com.study.rental.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.rental.exception.EquipmentNotFoundException;
import com.study.rental.exception.RentalConflictException;
import com.study.rental.exception.RentalNotFoundException;
import com.study.rental.mapper.RentalMapper;
import com.study.rental.model.Equipment;
import com.study.rental.model.Rental;
import com.study.rental.model.RentalRequest;

@Service
public class RentalService {
    private final RentalMapper mapper;

    public RentalService(RentalMapper mapper) {
        this.mapper = mapper;
    }

    public List<Equipment> equipments() {
        return mapper.findEquipments();
    }

    // study-target:svc-mine:start
    // TODO: 읽기 전용으로 내 대여 목록을 조회하는 mine 메서드를 작성한다.
    // study-target:svc-mine:end

    public List<Rental> all() {
        return mapper.findAll();
    }

    // study-target:svc-rent:start
    // TODO: 장비를 대여하는 rent 메서드를 작성한다. 하나의 트랜잭션으로 묶고 없는 장비와 이미 대여 중인 장비는 예외로 알린다
    // study-target:svc-rent:end

    // study-target:svc-access:start
    // TODO: 대여 한 건을 돌려주는 get 메서드를 작성한다. 관리자가 아니면 본인의 대여만 볼 수 있다
    // study-target:svc-access:end

    @Transactional
    public void cancel(int rentalId, String loginId, boolean admin) {
        get(rentalId, loginId, admin);
        mapper.delete(rentalId);
    }
}
