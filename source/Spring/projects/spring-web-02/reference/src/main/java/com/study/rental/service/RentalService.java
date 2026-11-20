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

    @Transactional(readOnly = true)
    public List<Rental> mine(String loginId) {
        return mapper.findByLoginId(loginId);
    }

    public List<Rental> all() {
        return mapper.findAll();
    }

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

    @Transactional
    public void cancel(int rentalId, String loginId, boolean admin) {
        get(rentalId, loginId, admin);
        mapper.delete(rentalId);
    }
}
