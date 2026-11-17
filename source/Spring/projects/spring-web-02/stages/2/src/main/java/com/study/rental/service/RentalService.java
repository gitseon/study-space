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

    public List<Rental> mine(String loginId) {
        return mapper.findByLoginId(loginId);
    }

    public List<Rental> all() {
        return mapper.findAll();
    }

    // study-target:svc-rent:start
    @Transactional
    public int rent(String loginId, RentalRequest request) {
        // TODO: 장비가 없으면 EquipmentNotFoundException, 이미 대여 중이면 RentalConflictException을 던진다
        // TODO: 대여를 저장하고 생성된 번호를 반환한다
        return 0;
    }
    // study-target:svc-rent:end

    // study-target:svc-access:start
    public Rental get(int rentalId, String loginId, boolean admin) {
        // TODO: 없는 번호는 RentalNotFoundException, 남의 대여를 일반 사용자가 보면 AccessDeniedException을 던진다
        return null;
    }
    // study-target:svc-access:end

    @Transactional
    public void cancel(int rentalId, String loginId, boolean admin) {
        get(rentalId, loginId, admin);
        mapper.delete(rentalId);
    }
}
