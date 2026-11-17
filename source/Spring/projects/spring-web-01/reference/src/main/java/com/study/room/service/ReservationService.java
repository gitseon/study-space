package com.study.room.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.room.exception.ReservationNotFoundException;
import com.study.room.exception.RoomFullException;
import com.study.room.mapper.ReservationMapper;
import com.study.room.model.Reservation;
import com.study.room.model.ReservationForm;
import com.study.room.model.StudyRoom;

@Service
public class ReservationService {
    private final ReservationMapper mapper;

    public ReservationService(ReservationMapper mapper) {
        this.mapper = mapper;
    }

    public List<Reservation> search(Integer roomId, String keyword) {
        return mapper.search(roomId, keyword);
    }

    public List<StudyRoom> rooms() {
        return mapper.findRooms();
    }

    public Reservation detail(int reservationId) {
        Reservation found = mapper.findById(reservationId);
        if (found == null) {
            throw new ReservationNotFoundException(reservationId);
        }
        return found;
    }

    @Transactional
    public int reserve(ReservationForm form) {
        StudyRoom room = mapper.findRoom(form.getRoomId());
        if (room == null) {
            throw new IllegalArgumentException("없는 방입니다: " + form.getRoomId());
        }
        int remaining = room.getCapacity() - mapper.sumPeople(room.getRoomId());
        if (form.getPeople() > remaining) {
            throw new RoomFullException(room.getRoomName(), remaining);
        }
        Reservation reservation = new Reservation();
        reservation.setRoomId(room.getRoomId());
        reservation.setMemberName(form.getMemberName());
        reservation.setPeople(form.getPeople());
        mapper.insert(reservation);
        return reservation.getReservationId();
    }

    @Transactional
    public void cancel(int reservationId) {
        if (mapper.delete(reservationId) == 0) {
            throw new ReservationNotFoundException(reservationId);
        }
    }
}
