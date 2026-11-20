package com.study.room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.study.room.model.Reservation;

/** Controller mappings, binding, validation, redirects and error statuses through MockMvc. */
@SpringBootTest
class HttpTests {
    @Autowired
    WebApplicationContext context;
    @Autowired
    JdbcTemplate jdbc;
    MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
        jdbc.update("DELETE FROM room_reservation");
        jdbc.update("INSERT INTO room_reservation (room_id, member_name, people) VALUES (1, '김하나', 2), (1, '이둘', 3), (2, '박셋', 2)");
    }

    private int idOf(String name) {
        return jdbc.queryForObject("SELECT reservation_id FROM room_reservation WHERE member_name = ?", Integer.class, name);
    }

    @Test
    void listShowsEveryReservationAndTheRooms() throws Exception {
        mvc.perform(get("/reservations")).andExpect(status().isOk()).andExpect(view().name("reservation/list"))
                .andExpect(model().attributeExists("reservations", "rooms"));
        List<?> rows = (List<?>) mvc.perform(get("/reservations")).andReturn().getModelAndView().getModel().get("reservations");
        assertEquals(3, rows.size());
    }

    @Test
    void listKeepsTheSearchConditionsInTheModel() throws Exception {
        var result = mvc.perform(get("/reservations").param("roomId", "1").param("keyword", "하나")).andExpect(status().isOk()).andReturn();
        assertEquals(1, ((List<?>) result.getModelAndView().getModel().get("reservations")).size());
        assertEquals(1, result.getModelAndView().getModel().get("roomId"));
        assertEquals("하나", result.getModelAndView().getModel().get("keyword"));
    }

    @Test
    void detailShowsTheReservationOrAnErrorStatus() throws Exception {
        mvc.perform(get("/reservations/" + idOf("이둘"))).andExpect(status().isOk()).andExpect(view().name("reservation/detail"))
                .andExpect(model().attributeExists("reservation"));
        mvc.perform(get("/reservations/999999")).andExpect(status().isNotFound()).andExpect(view().name("error/not-found"));
        mvc.perform(get("/reservations/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void invalidInputGoesBackToTheFormWithoutSaving() throws Exception {
        mvc.perform(post("/reservations").param("roomId", "1").param("memberName", " ").param("people", "0"))
                .andExpect(status().isOk()).andExpect(view().name("reservation/form"))
                .andExpect(model().attributeHasFieldErrors("form", "memberName", "people")).andExpect(model().attributeExists("rooms"));
        assertEquals(3, jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class));
    }

    @Test
    void validInputRedirectsToTheDetailWithAFlashMessage() throws Exception {
        mvc.perform(post("/reservations").param("roomId", "3").param("memberName", "최넷").param("people", "4"))
                .andExpect(status().isFound()).andExpect(redirectedUrlPattern("/reservations/*")).andExpect(flash().attribute("message", "예약했습니다"));
        assertEquals(4, jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class));
    }

    @Test
    void tooManyPeopleIsAConflictAndNothingIsSaved() throws Exception {
        mvc.perform(post("/reservations").param("roomId", "2").param("memberName", "정여섯").param("people", "3"))
                .andExpect(status().isConflict()).andExpect(view().name("error/full"));
        assertEquals(3, jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class));
    }

    @Test
    void cancelRedirectsToTheListAndAMissingOneIsNotFound() throws Exception {
        int id = idOf("박셋");
        mvc.perform(post("/reservations/" + id + "/delete")).andExpect(status().isFound()).andExpect(redirectedUrl("/reservations"))
                .andExpect(flash().attribute("message", "예약을 취소했습니다"));
        mvc.perform(post("/reservations/" + id + "/delete")).andExpect(status().isNotFound());
        assertNotNull(context);
    }

    @Test
    void theRootRedirectsToTheList() throws Exception {
        mvc.perform(get("/")).andExpect(status().isFound()).andExpect(redirectedUrl("/reservations"));
    }

    @Test
    void theModelClassIsUsedForTheRows() throws Exception {
        List<?> rows = (List<?>) mvc.perform(get("/reservations")).andReturn().getModelAndView().getModel().get("reservations");
        assertEquals(Reservation.class, rows.get(0).getClass());
    }
}
