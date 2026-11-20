package com.study.room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;

import com.study.room.exception.ReservationNotFoundException;
import com.study.room.exception.RoomFullException;
import com.study.room.mapper.ReservationMapper;
import com.study.room.model.Reservation;
import com.study.room.model.ReservationForm;
import com.study.room.model.StudyRoom;
import com.study.room.service.ReservationService;

/** The service rules without a database. */
class UnitTests {
    ReservationMapper mapper;
    ReservationService service;

    @BeforeEach
    void setUp() {
        mapper = mock(ReservationMapper.class);
        service = new ReservationService(mapper);
    }

    private StudyRoom room(int id, int capacity) {
        StudyRoom room = new StudyRoom();
        room.setRoomId(id);
        room.setRoomName("방" + id);
        room.setCapacity(capacity);
        return room;
    }

    private ReservationForm form(int roomId, int people) {
        ReservationForm form = new ReservationForm();
        form.setRoomId(roomId);
        form.setMemberName("김하나");
        form.setPeople(people);
        return form;
    }

    @Test
    void detailReturnsTheFoundReservation() {
        Reservation found = new Reservation();
        found.setReservationId(3);
        when(mapper.findById(3)).thenReturn(found);
        assertEquals(3, service.detail(3).getReservationId());
    }

    @Test
    void detailThrowsWhenNothingIsFound() {
        when(mapper.findById(9)).thenReturn(null);
        assertThrows(ReservationNotFoundException.class, () -> service.detail(9));
    }

    @Test
    void reserveStoresWhenThereIsRoomAndReturnsTheGeneratedKey() {
        when(mapper.findRoom(1)).thenReturn(room(1, 6));
        when(mapper.sumPeople(1)).thenReturn(2);
        when(mapper.insert(any(Reservation.class))).thenAnswer(call -> {
            call.<Reservation>getArgument(0).setReservationId(7);
            return 1;
        });
        assertEquals(7, service.reserve(form(1, 4)));
    }

    @Test
    void reserveRejectsMoreThanTheRemainingSeatsWithoutStoring() {
        when(mapper.findRoom(1)).thenReturn(room(1, 6));
        when(mapper.sumPeople(1)).thenReturn(2);
        assertThrows(RoomFullException.class, () -> service.reserve(form(1, 5)));
        verify(mapper, never()).insert(any(Reservation.class));
    }

    @Test
    void reserveRejectsAnUnknownRoom() {
        when(mapper.findRoom(anyInt())).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> service.reserve(form(8, 1)));
        verify(mapper, never()).insert(any(Reservation.class));
    }

    @Test
    void cancelThrowsWhenNoRowWasDeleted() {
        when(mapper.delete(5)).thenReturn(0);
        assertThrows(ReservationNotFoundException.class, () -> service.cancel(5));
        when(mapper.delete(6)).thenReturn(1);
        service.cancel(6);
        verify(mapper).delete(6);
    }

    @Test
    void dtoSupportsBuilderConstructorsAndAccessors() {
        Reservation reservation = Reservation.builder().reservationId(3).roomId(1).roomName("A").memberName("민수").people(2).build();
        assertEquals(3, reservation.getReservationId());
        assertEquals("A", reservation.getRoomName());
        Reservation fromConstructor = new Reservation(3, 1, "A", "민수", 2);
        assertEquals("민수", fromConstructor.getMemberName());
        reservation.setPeople(4);
        assertEquals(4, reservation.getPeople());
    }

    @Test
    void listingDelegatesToMapperInAReadOnlyTransaction() throws Exception {
        Transactional transaction = ReservationService.class.getMethod("search", Integer.class, String.class).getAnnotation(Transactional.class);
        assertTrue(transaction != null && transaction.readOnly());
        List<Reservation> rows = List.of(new Reservation());
        when(mapper.search(2, "민")).thenReturn(rows);
        assertEquals(rows, service.search(2, "민"));
    }

    @Test
    void changingMethodsAreTransactional() throws Exception {
        assertTrue(ReservationService.class.getMethod("reserve", ReservationForm.class).isAnnotationPresent(Transactional.class));
        assertTrue(ReservationService.class.getMethod("cancel", int.class).isAnnotationPresent(Transactional.class));
    }
}
