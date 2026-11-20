package com.study.rental;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/** The whole security and REST contract through MockMvc with the real filter chain. */
@SpringBootTest
class HttpTests {
    @Autowired
    WebApplicationContext context;
    @Autowired
    JdbcTemplate jdbc;
    MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        jdbc.update("DELETE FROM equipment_rental");
        jdbc.update("INSERT INTO equipment_rental (equipment_id, login_id, days) VALUES (1, 'mina', 3), (2, 'jun', 2)");
    }

    private MockHttpSession login(String user) throws Exception {
        return (MockHttpSession) mvc.perform(formLogin().user(user).password("study1234")).andExpect(status().isOk()).andReturn().getRequest().getSession(false);
    }

    private int rentalOf(String user) {
        return jdbc.queryForObject("SELECT rental_id FROM equipment_rental WHERE login_id = ?", Integer.class, user);
    }

    private int count() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM equipment_rental", Integer.class);
    }

    @Test
    void anonymousUsersSeeEquipmentsButGetA401NotARedirectElsewhere() throws Exception {
        mvc.perform(get("/api/equipments")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(3));
        mvc.perform(get("/api/rentals")).andExpect(status().isUnauthorized()).andExpect(header().doesNotExist("Location"));
        mvc.perform(get("/api/rentals/1")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/rentals")).andExpect(status().isUnauthorized());
    }

    @Test
    void loginSucceedsWith200AndFailsWith401() throws Exception {
        mvc.perform(formLogin().user("mina").password("study1234")).andExpect(status().isOk());
        mvc.perform(formLogin().user("mina").password("wrong")).andExpect(status().isUnauthorized());
        mvc.perform(formLogin().user("ghost").password("study1234")).andExpect(status().isUnauthorized());
        mvc.perform(post("/login").param("username", "mina").param("password", "study1234")).andExpect(status().isForbidden());
    }

    @Test
    void logoutAnswers204AndEndsTheSession() throws Exception {
        MockHttpSession session = login("mina");
        mvc.perform(post("/logout").session(session).with(csrf())).andExpect(status().isNoContent());
        mvc.perform(get("/api/rentals").session(session)).andExpect(status().isUnauthorized());
    }

    @Test
    void rentCreatesWith201LocationAndTheNewRental() throws Exception {
        MockHttpSession session = login("mina");
        var result = mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":4}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.loginId").value("mina")).andExpect(jsonPath("$.equipmentName").value("빔 프로젝터"))
                .andExpect(jsonPath("$.days").value(4)).andReturn();
        String location = result.getResponse().getHeader("Location");
        assertTrue(location.matches("/api/rentals/\\d+"), location);
        assertEquals(3, count());
        mvc.perform(get(location).session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.equipmentId").value(3));
    }

    @Test
    void rentNeedsALoginAndACsrfToken() throws Exception {
        mvc.perform(post("/api/rentals").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":1}")).andExpect(status().isUnauthorized());
        MockHttpSession session = login("mina");
        mvc.perform(post("/api/rentals").session(session).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":1}")).andExpect(status().isForbidden());
        assertEquals(2, count());
    }

    @Test
    void invalidBodiesAreRejectedWith400AndNothingIsSaved() throws Exception {
        MockHttpSession session = login("mina");
        mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":0}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"days\":2}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":15}"))
                .andExpect(status().isBadRequest());
        assertEquals(2, count());
    }

    @Test
    void unknownAndAlreadyRentedEquipmentAre404And409() throws Exception {
        MockHttpSession session = login("jun");
        mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":99,\"days\":1}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("NOT_FOUND"));
        mvc.perform(post("/api/rentals").session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":1,\"days\":1}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("CONFLICT"));
        assertEquals(2, count());
    }

    @Test
    void anOwnerAndAnAdminMayReadARentalButAnotherUserMayNot() throws Exception {
        int id = rentalOf("mina");
        mvc.perform(get("/api/rentals/" + id).session(login("mina"))).andExpect(status().isOk()).andExpect(jsonPath("$.equipmentName").value("노트북"));
        mvc.perform(get("/api/rentals/" + id).session(login("root"))).andExpect(status().isOk());
        mvc.perform(get("/api/rentals/" + id).session(login("jun"))).andExpect(status().isForbidden());
    }

    @Test
    void aMissingRentalIs404WithAJsonBody() throws Exception {
        mvc.perform(get("/api/rentals/999999").session(login("mina"))).andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON)).andExpect(jsonPath("$.code").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    void theListsAreScopedByUserAndByRole() throws Exception {
        mvc.perform(get("/api/rentals").session(login("mina"))).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].loginId").value("mina"));
        mvc.perform(get("/api/admin/rentals").session(login("root"))).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/admin/rentals").session(login("mina"))).andExpect(status().isForbidden());
    }

    @Test
    void cancelAnswers204WithoutABodyAndThenAnotherCancelIs404() throws Exception {
        int id = rentalOf("mina");
        MockHttpSession session = login("mina");
        mvc.perform(delete("/api/rentals/" + id).session(session)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/rentals/" + id).session(session).with(csrf())).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(delete("/api/rentals/" + id).session(session).with(csrf())).andExpect(status().isNotFound());
        assertEquals(1, count());
    }

    @Test
    void anotherUserCannotCancelAndNothingIsDeleted() throws Exception {
        int id = rentalOf("mina");
        mvc.perform(delete("/api/rentals/" + id).session(login("jun")).with(csrf())).andExpect(status().isForbidden());
        assertEquals(2, count());
    }
}
