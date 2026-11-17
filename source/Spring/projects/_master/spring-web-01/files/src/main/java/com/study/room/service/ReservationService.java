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

    // @@target svc-detail
    public Reservation detail(int reservationId) {
        Reservation found = mapper.findById(reservationId);
        if (found == null) {
            throw new ReservationNotFoundException(reservationId);
        }
        return found;
    }
    // @@stage 1
    public Reservation detail(int reservationId) {
        Reservation found = mapper.____(reservationId);
        if (found == null) {
            throw new ____(reservationId);
        }
        return found;
    }
    // @@stage 2
    public Reservation detail(int reservationId) {
        // TODO: 예약을 조회하고 없으면 ReservationNotFoundException을 던진다
        return null;
    }
    // @@stage 3
    // TODO: 예약 한 건을 조회하는 detail 메서드를 작성한다. 없으면 ReservationNotFoundException을 던진다
    // @@end

    // @@target svc-reserve
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
    // @@stage 1
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
    // @@stage 2
    @Transactional
    public int reserve(ReservationForm form) {
        // TODO: 방을 찾고 남은 자리를 계산해 넘으면 RoomFullException을 던진다
        // TODO: 예약을 저장하고 생성된 번호를 반환한다
        return 0;
    }
    // @@stage 3
    // TODO: 예약을 저장하는 reserve 메서드를 작성한다. 트랜잭션 하나로 묶고 남은 자리를 넘으면 RoomFullException을 던진다
    // @@end

    // @@target svc-cancel
    @Transactional
    public void cancel(int reservationId) {
        if (mapper.delete(reservationId) == 0) {
            throw new ReservationNotFoundException(reservationId);
        }
    }
    // @@stage 1
    @Transactional
    public void cancel(int reservationId) {
        if (mapper.delete(reservationId) == ____) {
            throw new ReservationNotFoundException(reservationId);
        }
    }
    // @@stage 2
    @Transactional
    public void cancel(int reservationId) {
        // TODO: 예약을 삭제하고 지운 행이 없으면 ReservationNotFoundException을 던진다
    }
    // @@stage 3
    // TODO: 예약을 취소하는 cancel 메서드를 작성한다
    // @@end
}
