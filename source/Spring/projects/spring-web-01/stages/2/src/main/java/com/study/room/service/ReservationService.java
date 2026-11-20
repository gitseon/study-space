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
    // TODO: 읽기 전용 트랜잭션을 선언한다.
    public List<Reservation> search(Integer roomId, String keyword) {
        // TODO: 제공된 매퍼로 조건에 맞는 예약 목록을 조회한다.
        return List.of();
    }
    // study-target:svc-search:end

    public List<StudyRoom> rooms() {
        return mapper.findRooms();
    }

    // study-target:svc-detail:start
    public Reservation detail(int reservationId) {
        // TODO: 예약을 조회하고 없으면 ReservationNotFoundException을 던진다
        return null;
    }
    // study-target:svc-detail:end

    // study-target:svc-reserve:start
    @Transactional
    public int reserve(ReservationForm form) {
        // TODO: 방을 찾고 남은 자리를 계산해 넘으면 RoomFullException을 던진다
        // TODO: 예약을 저장하고 생성된 번호를 반환한다
        return 0;
    }
    // study-target:svc-reserve:end

    // study-target:svc-cancel:start
    @Transactional
    public void cancel(int reservationId) {
        // TODO: 예약을 삭제하고 지운 행이 없으면 ReservationNotFoundException을 던진다
    }
    // study-target:svc-cancel:end
}
