package com.study.room.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.study.room.model.Reservation;
import com.study.room.model.StudyRoom;

@Mapper
public interface ReservationMapper {
    List<StudyRoom> findRooms();

    StudyRoom findRoom(int roomId);

    int sumPeople(int roomId);

    List<Reservation> search(@Param("roomId") Integer roomId, @Param("keyword") String keyword);

    Reservation findById(int reservationId);

    int insert(Reservation reservation);

    int delete(int reservationId);
}
