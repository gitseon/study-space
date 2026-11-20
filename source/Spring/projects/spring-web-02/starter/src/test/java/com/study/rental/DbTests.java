package com.study.rental;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.study.rental.exception.EquipmentNotFoundException;
import com.study.rental.exception.RentalConflictException;
import com.study.rental.mapper.MemberMapper;
import com.study.rental.mapper.RentalMapper;
import com.study.rental.model.Rental;
import com.study.rental.model.RentalRequest;
import com.study.rental.security.DbUserDetailsService;
import com.study.rental.service.RentalService;

/** Mapper, service and user lookup against the real MySQL schema. */
@SpringBootTest
class DbTests {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    RentalMapper mapper;
    @Autowired
    MemberMapper members;
    @Autowired
    RentalService service;
    @Autowired
    DbUserDetailsService users;
    @Autowired
    PasswordEncoder encoder;

    @BeforeEach
    void seed() {
        jdbc.update("DELETE FROM equipment_rental");
        jdbc.update("INSERT INTO equipment_rental (equipment_id, login_id, days) VALUES (1, 'mina', 3), (2, 'jun', 2)");
    }

    private int count() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM equipment_rental", Integer.class);
    }

    @Test
    void equipmentsAreListedInOrder() {
        assertEquals(List.of("노트북", "카메라", "빔 프로젝터"), mapper.findEquipments().stream().map(e -> e.getName()).toList());
    }

    @Test
    void activeRentalsAreCountedPerEquipment() {
        assertEquals(1, mapper.countActive(1));
        assertEquals(0, mapper.countActive(3));
    }

    @Test
    void insertFillsTheGeneratedKey() {
        Rental rental = new Rental();
        rental.setEquipmentId(3);
        rental.setLoginId("mina");
        rental.setDays(5);
        assertEquals(1, mapper.insert(rental));
        assertNotNull(rental.getRentalId());
        assertEquals("빔 프로젝터", mapper.findById(rental.getRentalId()).getEquipmentName());
    }

    @Test
    void findByIdJoinsTheEquipmentNameAndReturnsNullWhenMissing() {
        int id = mapper.findByLoginId("jun").get(0).getRentalId();
        Rental found = mapper.findById(id);
        assertEquals("카메라", found.getEquipmentName());
        assertEquals("jun", found.getLoginId());
        assertEquals(2, found.getDays());
        assertNull(mapper.findById(999999));
    }

    @Test
    void findByLoginIdReturnsOnlyThatUsersRentalsInOrder() {
        jdbc.update("INSERT INTO equipment_rental (equipment_id, login_id, days) VALUES (3, 'mina', 1)");
        List<Rental> mine = mapper.findByLoginId("mina");
        assertEquals(List.of("노트북", "빔 프로젝터"), mine.stream().map(Rental::getEquipmentName).toList());
        assertTrue(mine.get(0).getRentalId() < mine.get(1).getRentalId());
        assertEquals(List.of(), mapper.findByLoginId("nobody"));
        assertEquals(3, mapper.findAll().size());
    }

    @Test
    void rentSavesOnceAndRejectsTheSameEquipmentAgain() {
        int id = service.rent("jun", new RentalRequest(3, 4));
        assertEquals("jun", service.get(id, "jun", false).getLoginId());
        int before = count();
        assertThrows(RentalConflictException.class, () -> service.rent("mina", new RentalRequest(3, 1)));
        assertThrows(EquipmentNotFoundException.class, () -> service.rent("mina", new RentalRequest(99, 1)));
        assertEquals(before, count());
    }

    @Test
    void cancelDeletesTheRental() {
        int id = mapper.findByLoginId("mina").get(0).getRentalId();
        service.cancel(id, "mina", false);
        assertEquals(1, count());
    }

    @Test
    void usersAreLoadedWithRolesAndAHashedPassword() {
        UserDetails root = users.loadUserByUsername("root");
        assertEquals("root", root.getUsername());
        assertEquals("ROLE_ADMIN", root.getAuthorities().iterator().next().getAuthority());
        assertTrue(root.getPassword().startsWith("{bcrypt}"));
        assertTrue(encoder.matches("study1234", root.getPassword()));
        assertEquals("ROLE_USER", users.loadUserByUsername("mina").getAuthorities().iterator().next().getAuthority());
        assertEquals("USER", members.findByLoginId("jun").getRole());
        assertThrows(UsernameNotFoundException.class, () -> users.loadUserByUsername("ghost"));
    }
}
