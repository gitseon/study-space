package com.study.room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import com.study.room.exception.ReservationNotFoundException;
import com.study.room.exception.RoomFullException;
import com.study.room.mapper.ReservationMapper;
import com.study.room.model.Reservation;
import com.study.room.model.ReservationForm;
import com.study.room.service.ReservationService;

/** Mapper and service against the real MySQL schema. */
@SpringBootTest
class DbTests {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    ReservationMapper mapper;
    @Autowired
    ReservationService service;

    @BeforeEach
    void seed() {
        jdbc.update("DELETE FROM room_reservation");
        jdbc.update("INSERT INTO room_reservation (room_id, member_name, people) VALUES (1, '김하나', 2), (1, '이둘', 3), (2, '박셋', 2)");
    }

    private List<String> names(List<Reservation> rows) {
        return rows.stream().map(Reservation::getMemberName).toList();
    }

    private int count() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class);
    }

    @Test
    void searchWithoutConditionsReturnsEveryRowInOrder() {
        assertEquals(List.of("김하나", "이둘", "박셋"), names(mapper.search(null, null)));
        assertEquals(List.of("김하나", "이둘", "박셋"), names(mapper.search(null, "")));
    }

    @Test
    void searchFiltersByRoomAndByPartOfTheName() {
        assertEquals(List.of("김하나", "이둘"), names(mapper.search(1, null)));
        assertEquals(List.of("이둘"), names(mapper.search(null, "둘")));
        assertEquals(List.of("김하나"), names(mapper.search(1, "하나")));
        assertEquals(List.of(), names(mapper.search(2, "하나")));
    }

    @Test
    void searchBindsTheKeywordAsAValue() {
        assertEquals(List.of(), names(mapper.search(null, "x' OR '1'='1")));
    }

    @Test
    void searchFillsTheRoomNameFromTheJoin() {
        assertEquals("소회의실 A", mapper.search(1, null).get(0).getRoomName());
    }

    @Test
    void findByIdJoinsTheRoomNameAndReturnsNullWhenMissing() {
        int id = mapper.search(null, "박셋").get(0).getReservationId();
        Reservation found = mapper.findById(id);
        assertEquals("소회의실 B", found.getRoomName());
        assertEquals(2, found.getPeople());
        assertNull(mapper.findById(999999));
    }

    @Test
    void insertFillsTheGeneratedKeyAndReturnsOneRow() {
        Reservation reservation = new Reservation();
        reservation.setRoomId(3);
        reservation.setMemberName("최넷");
        reservation.setPeople(4);
        assertEquals(1, mapper.insert(reservation));
        assertNotNull(reservation.getReservationId());
        assertEquals("최넷", mapper.findById(reservation.getReservationId()).getMemberName());
    }

    @Test
    void reserveSavesAndRejectsMoreThanTheRemainingSeats() {
        ReservationForm form = new ReservationForm();
        form.setRoomId(2);
        form.setMemberName("정여섯");
        form.setPeople(2);
        int id = service.reserve(form);
        assertEquals("정여섯", service.detail(id).getMemberName());
        int before = count();
        form.setPeople(1);
        assertThrows(RoomFullException.class, () -> service.reserve(form));
        assertEquals(before, count());
    }

    @Test
    void cancelDeletesOnceAndThenReportsMissing() {
        int id = mapper.search(null, "박셋").get(0).getReservationId();
        service.cancel(id);
        assertEquals(2, count());
        assertThrows(ReservationNotFoundException.class, () -> service.cancel(id));
    }
}
