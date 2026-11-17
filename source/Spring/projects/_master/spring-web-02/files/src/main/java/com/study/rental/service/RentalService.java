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

    // @@target svc-rent
    @Transactional
    public int rent(String loginId, RentalRequest request) {
        Equipment equipment = mapper.findEquipment(request.equipmentId());
        if (equipment == null) {
            throw new EquipmentNotFoundException(request.equipmentId());
        }
        if (mapper.countActive(equipment.getEquipmentId()) > 0) {
            throw new RentalConflictException(equipment.getName());
        }
        Rental rental = new Rental();
        rental.setEquipmentId(equipment.getEquipmentId());
        rental.setLoginId(loginId);
        rental.setDays(request.days());
        mapper.insert(rental);
        return rental.getRentalId();
    }
    // @@stage 1
    @____
    public int rent(String loginId, RentalRequest request) {
        Equipment equipment = mapper.findEquipment(request.equipmentId());
        if (equipment == null) {
            throw new EquipmentNotFoundException(request.equipmentId());
        }
        if (mapper.countActive(equipment.getEquipmentId()) > ____) {
            throw new RentalConflictException(equipment.getName());
        }
        Rental rental = new Rental();
        rental.setEquipmentId(equipment.getEquipmentId());
        rental.setLoginId(loginId);
        rental.setDays(request.days());
        mapper.____(rental);
        return rental.getRentalId();
    }
    // @@stage 2
    @Transactional
    public int rent(String loginId, RentalRequest request) {
        // TODO: 장비가 없으면 EquipmentNotFoundException, 이미 대여 중이면 RentalConflictException을 던진다
        // TODO: 대여를 저장하고 생성된 번호를 반환한다
        return 0;
    }
    // @@stage 3
    // TODO: 장비를 대여하는 rent 메서드를 작성한다. 하나의 트랜잭션으로 묶고 없는 장비와 이미 대여 중인 장비는 예외로 알린다
    // @@end

    // @@target svc-access
    public Rental get(int rentalId, String loginId, boolean admin) {
        Rental rental = mapper.findById(rentalId);
        if (rental == null) {
            throw new RentalNotFoundException(rentalId);
        }
        if (!admin && !rental.getLoginId().equals(loginId)) {
            throw new AccessDeniedException("본인의 대여만 볼 수 있습니다");
        }
        return rental;
    }
    // @@stage 1
    public Rental get(int rentalId, String loginId, boolean admin) {
        Rental rental = mapper.____(rentalId);
        if (rental == null) {
            throw new RentalNotFoundException(rentalId);
        }
        if (!admin && !rental.getLoginId().____(loginId)) {
            throw new AccessDeniedException("본인의 대여만 볼 수 있습니다");
        }
        return rental;
    }
    // @@stage 2
    public Rental get(int rentalId, String loginId, boolean admin) {
        // TODO: 없는 번호는 RentalNotFoundException, 남의 대여를 일반 사용자가 보면 AccessDeniedException을 던진다
        return null;
    }
    // @@stage 3
    // TODO: 대여 한 건을 돌려주는 get 메서드를 작성한다. 관리자가 아니면 본인의 대여만 볼 수 있다
    // @@end

    @Transactional
    public void cancel(int rentalId, String loginId, boolean admin) {
        get(rentalId, loginId, admin);
        mapper.delete(rentalId);
    }
}
