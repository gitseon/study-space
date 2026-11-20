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

    // study-target:svc-search:start
    @Transactional(readOnly = ____)
    public List<Reservation> search(Integer roomId, String keyword) {
        return mapper.search(roomId, keyword);
    }
    // study-target:svc-search:end

    public List<StudyRoom> rooms() {
        return mapper.findRooms();
    }

    // study-target:svc-detail:start
    public Reservation detail(int reservationId) {
        Reservation found = mapper.____(reservationId);
        if (found == null) {
            throw new ____(reservationId);
        }
        return found;
    }
    // study-target:svc-detail:end

    // study-target:svc-reserve:start
    @____
    public int reserve(ReservationForm form) {
        StudyRoom room = mapper.findRoom(form.getRoomId());
        if (room == null) {
            throw new IllegalArgumentException("없는 방입니다: " + form.getRoomId());
        }
        int remaining = room.getCapacity() - mapper.sumPeople(room.getRoomId());
        if (form.getPeople() > ____) {
            throw new RoomFullException(room.getRoomName(), remaining);
        }
        Reservation reservation = new Reservation();
        reservation.setRoomId(room.getRoomId());
        reservation.setMemberName(form.getMemberName());
        reservation.setPeople(form.getPeople());
        mapper.____(reservation);
        return reservation.getReservationId();
    }
    // study-target:svc-reserve:end

    // study-target:svc-cancel:start
    @Transactional
    public void cancel(int reservationId) {
        if (mapper.delete(reservationId) == ____) {
            throw new ReservationNotFoundException(reservationId);
        }
    }
    // study-target:svc-cancel:end
}
