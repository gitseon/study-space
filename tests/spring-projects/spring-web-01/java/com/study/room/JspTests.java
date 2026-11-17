package com.study.room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

/** The real embedded Tomcat renders the JSP pages and the redirects work for a browser with a session. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class JspTests {
    @LocalServerPort
    int port;
    @Autowired
    JdbcTemplate jdbc;
    HttpClient client;

    @BeforeEach
    void setUp() {
        client = HttpClient.newBuilder().cookieHandler(new CookieManager()).followRedirects(HttpClient.Redirect.NORMAL).build();
        jdbc.update("DELETE FROM room_reservation");
        jdbc.update("INSERT INTO room_reservation (room_id, member_name, people) VALUES (1, '김하나', 2), (1, '이둘', 3), (2, '박셋', 2)");
    }

    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build(),
                HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    }

    private HttpResponse<String> post(String path, String form) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8").POST(HttpRequest.BodyPublishers.ofString(form)).build(),
                HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    }

    private int count(String text, String part) {
        return text.split(java.util.regex.Pattern.quote(part), -1).length - 1;
    }

    @Test
    void theListPageIsRenderedWithOneRowPerReservation() throws Exception {
        HttpResponse<String> response = get("/reservations");
        assertEquals(200, response.statusCode());
        assertTrue(response.headers().firstValue("Content-Type").orElse("").contains("text/html"));
        String body = response.body();
        assertTrue(body.contains("예약 목록") && body.contains("소회의실 A") && body.contains("김하나"));
        assertEquals(3, count(body, "<td><a href="));
        assertFalse(body.contains("${"), "EL must be evaluated");
    }

    @Test
    void theSearchShowsOnlyMatchingRowsAndTheEmptyMessageWhenNothingMatches() throws Exception {
        String one = get("/reservations?roomId=2").body();
        assertEquals(1, count(one, "<td><a href="));
        assertTrue(one.contains("박셋") && !one.contains("김하나"));
        String none = get("/reservations?keyword=nobody").body();
        assertTrue(none.contains("예약이 없습니다."));
        assertEquals(0, count(none, "<td><a href="));
    }

    @Test
    void valuesAreEscapedByCOut() throws Exception {
        jdbc.update("INSERT INTO room_reservation (room_id, member_name, people) VALUES (3, '<b>x</b>', 1)");
        String body = get("/reservations").body();
        assertTrue(body.contains("&lt;b&gt;x&lt;/b&gt;"));
        assertFalse(body.contains("<b>x</b>"));
    }

    @Test
    void theDetailPageShowsTheReservationAndACancelForm() throws Exception {
        int id = jdbc.queryForObject("SELECT reservation_id FROM room_reservation WHERE member_name = '이둘'", Integer.class);
        HttpResponse<String> response = get("/reservations/" + id);
        assertEquals(200, response.statusCode());
        String body = response.body();
        assertTrue(body.contains("예약 상세") && body.contains("이둘") && body.contains("소회의실 A"));
        assertTrue(body.contains("method=\"post\"") && body.contains("/reservations/" + id + "/delete"));
    }

    @Test
    void aMissingReservationShowsTheNotFoundPageWith404() throws Exception {
        HttpResponse<String> response = get("/reservations/999999");
        assertEquals(404, response.statusCode());
        assertTrue(response.body().contains("찾을 수 없습니다"));
    }

    @Test
    void theFormListsTheRoomsAndKeepsTheInputWhenValidationFails() throws Exception {
        String form = get("/reservations/new").body();
        assertEquals(3, count(form, "<option value="));
        HttpResponse<String> invalid = post("/reservations", "roomId=1&memberName=&people=0");
        assertEquals(200, invalid.statusCode());
        assertTrue(invalid.body().contains("예약자 이름을 입력하세요") && invalid.body().contains("인원은 1명 이상입니다"));
        assertEquals(3, jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class));
    }

    @Test
    void aSuccessfulReservationEndsOnTheDetailPageWithTheFlashMessageOnce() throws Exception {
        HttpResponse<String> done = post("/reservations", "roomId=3&memberName=%EC%B5%9C%EB%84%B7&people=4");
        assertEquals(200, done.statusCode());
        HttpResponse<String> redirect = done.previousResponse().orElseThrow();
        assertEquals(302, redirect.statusCode());
        String location = redirect.headers().firstValue("Location").orElse("");
        // The first response of a new session may carry ;jsessionid in the Location.
        assertTrue(location.matches(".*/reservations/\\d+(;jsessionid=\\w+)?"), location);
        assertTrue(done.body().contains("예약했습니다") && done.body().contains("최넷"));
        HttpResponse<String> again = get(URI.create(location.replaceAll(";.*$", "")).getPath());
        assertFalse(again.body().contains("예약했습니다"), "the flash message is shown once");
        assertEquals(4, jdbc.queryForObject("SELECT COUNT(*) FROM room_reservation", Integer.class));
    }

    @Test
    void tooManyPeopleShowsTheConflictPage() throws Exception {
        HttpResponse<String> response = post("/reservations", "roomId=2&memberName=%EC%A0%95&people=3");
        assertEquals(409, response.statusCode());
        assertTrue(response.body().contains("예약할 수 없습니다"));
    }

    @Test
    void cancelingRedirectsToTheListWithTheMessage() throws Exception {
        int id = jdbc.queryForObject("SELECT reservation_id FROM room_reservation WHERE member_name = '박셋'", Integer.class);
        HttpResponse<String> response = post("/reservations/" + id + "/delete", "");
        assertEquals(200, response.statusCode());
        assertEquals(302, response.previousResponse().orElseThrow().statusCode());
        assertTrue(response.previousResponse().get().headers().firstValue("Location").orElse("").matches(".*/reservations(;jsessionid=\\w+)?"));
        assertTrue(response.body().contains("예약을 취소했습니다") && !response.body().contains("박셋"));
    }
}
