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

    // study-target:svc-detail:start
    // TODO: 예약 한 건을 조회하는 detail 메서드를 작성한다. 없으면 ReservationNotFoundException을 던진다
    // study-target:svc-detail:end

    // study-target:svc-reserve:start
    // TODO: 예약을 저장하는 reserve 메서드를 작성한다. 트랜잭션 하나로 묶고 남은 자리를 넘으면 RoomFullException을 던진다
    // study-target:svc-reserve:end

    // study-target:svc-cancel:start
    // TODO: 예약을 취소하는 cancel 메서드를 작성한다
    // study-target:svc-cancel:end
}
