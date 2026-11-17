package com.study.rental.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.study.rental.model.Equipment;
import com.study.rental.model.Rental;

@Mapper
public interface RentalMapper {
    List<Equipment> findEquipments();

    Equipment findEquipment(int equipmentId);

    int countActive(int equipmentId);

    int insert(Rental rental);

    Rental findById(int rentalId);

    List<Rental> findByLoginId(String loginId);

    List<Rental> findAll();

    int delete(int rentalId);
}
