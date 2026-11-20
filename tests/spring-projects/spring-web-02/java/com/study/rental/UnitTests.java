package com.study.rental;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import com.study.rental.exception.EquipmentNotFoundException;
import com.study.rental.exception.RentalConflictException;
import com.study.rental.exception.RentalNotFoundException;
import com.study.rental.mapper.RentalMapper;
import com.study.rental.model.Equipment;
import com.study.rental.model.Rental;
import com.study.rental.model.RentalRequest;
import com.study.rental.service.RentalService;

/** The service rules without a database. */
class UnitTests {
    RentalMapper mapper;
    RentalService service;

    @BeforeEach
    void setUp() {
        mapper = mock(RentalMapper.class);
        service = new RentalService(mapper);
    }

    private Equipment equipment(int id) {
        Equipment equipment = new Equipment();
        equipment.setEquipmentId(id);
        equipment.setName("노트북");
        return equipment;
    }

    private Rental rental(int id, String owner) {
        Rental rental = new Rental();
        rental.setRentalId(id);
        rental.setLoginId(owner);
        return rental;
    }

    @Test
    void rentStoresAndReturnsTheGeneratedNumber() {
        when(mapper.findEquipment(1)).thenReturn(equipment(1));
        when(mapper.countActive(1)).thenReturn(0);
        when(mapper.insert(any(Rental.class))).thenAnswer(call -> {
            call.<Rental>getArgument(0).setRentalId(5);
            return 1;
        });
        assertEquals(5, service.rent("mina", new RentalRequest(1, 3)));
    }

    @Test
    void rentRejectsAnUnknownEquipmentAndAnEquipmentThatIsAlreadyRented() {
        when(mapper.findEquipment(9)).thenReturn(null);
        assertThrows(EquipmentNotFoundException.class, () -> service.rent("mina", new RentalRequest(9, 1)));
        when(mapper.findEquipment(1)).thenReturn(equipment(1));
        when(mapper.countActive(1)).thenReturn(1);
        assertThrows(RentalConflictException.class, () -> service.rent("mina", new RentalRequest(1, 1)));
        verify(mapper, never()).insert(any(Rental.class));
    }

    @Test
    void getOnlyShowsTheOwnersRentalUnlessTheUserIsAnAdmin() {
        when(mapper.findById(1)).thenReturn(rental(1, "mina"));
        assertEquals(1, service.get(1, "mina", false).getRentalId());
        assertEquals(1, service.get(1, "root", true).getRentalId());
        assertThrows(AccessDeniedException.class, () -> service.get(1, "jun", false));
    }

    @Test
    void getReportsAMissingRental() {
        when(mapper.findById(7)).thenReturn(null);
        assertThrows(RentalNotFoundException.class, () -> service.get(7, "mina", false));
    }

    @Test
    void cancelDeletesOnlyAfterTheAccessCheck() {
        when(mapper.findById(1)).thenReturn(rental(1, "mina"));
        assertThrows(AccessDeniedException.class, () -> service.cancel(1, "jun", false));
        verify(mapper, never()).delete(1);
        service.cancel(1, "mina", false);
        verify(mapper).delete(1);
    }

    @Test
    void dtoSupportsBuilderConstructorsAndAccessors() {
        Rental rental = Rental.builder().rentalId(3).equipmentId(1).equipmentName("카메라").loginId("mina").days(2).build();
        assertEquals(3, rental.getRentalId());
        assertEquals("카메라", rental.getEquipmentName());
        Rental fromConstructor = new Rental(3, 1, "카메라", "mina", 2);
        assertEquals("mina", fromConstructor.getLoginId());
        rental.setDays(4);
        assertEquals(4, rental.getDays());
    }

    @Test
    void listingDelegatesToMapperInAReadOnlyTransaction() throws Exception {
        Transactional transaction = RentalService.class.getMethod("mine", String.class).getAnnotation(Transactional.class);
        assertTrue(transaction != null && transaction.readOnly());
        List<Rental> rows = List.of(new Rental());
        when(mapper.findByLoginId("mina")).thenReturn(rows);
        assertEquals(rows, service.mine("mina"));
    }

    @Test
    void changingMethodsAreTransactional() throws Exception {
        assertTrue(RentalService.class.getMethod("rent", String.class, RentalRequest.class).isAnnotationPresent(Transactional.class));
        assertTrue(RentalService.class.getMethod("cancel", int.class, String.class, boolean.class).isAnnotationPresent(Transactional.class));
    }
}
