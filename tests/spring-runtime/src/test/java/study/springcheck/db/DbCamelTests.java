package study.springcheck.db;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import study.springcheck.Observations;
import study.springcheck.db.DbApp.Reservation;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Same schema as DbTests with map-underscore-to-camel-case switched on. */
@SpringBootTest(classes = DbApp.class, properties = {
        "spring.main.web-application-type=none",
        "spring.datasource.url=${SPRING_VERIFY_DB_URL}",
        "spring.datasource.username=${SPRING_VERIFY_DB_USER}",
        "spring.datasource.password=${SPRING_VERIFY_DB_PASSWORD}",
        "mybatis.mapper-locations=classpath:mapper/*.xml",
        "mybatis.configuration.map-underscore-to-camel-case=true"})
class DbCamelTests {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    DbApp.ReservationMapper mapper;

    @BeforeEach
    void reset() {
        jdbc.execute("DROP TABLE IF EXISTS reservation");
        jdbc.execute("DROP TABLE IF EXISTS audit_log");
        jdbc.execute("DROP TABLE IF EXISTS room");
        jdbc.execute("CREATE TABLE room (room_id INT PRIMARY KEY, room_name VARCHAR(30) NOT NULL)");
        jdbc.execute("CREATE TABLE reservation (reservation_id INT AUTO_INCREMENT PRIMARY KEY, room_id INT NOT NULL, member_name VARCHAR(30) NOT NULL, people INT NOT NULL)");
        jdbc.execute("CREATE TABLE audit_log (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(50) NOT NULL)");
        jdbc.update("INSERT INTO room VALUES (1, 'A'), (2, 'B'), (3, 'C')");
        jdbc.update("INSERT INTO reservation (room_id, member_name, people) VALUES (1, 'kim', 2), (1, 'lee', 4), (2, 'kimchi', 2)");
    }

    @Test
    void underscoreColumnsReachCamelCaseProperties() {
        Reservation raw = mapper.findRaw(1);
        String observed = raw.getMemberName() + " " + raw.getReservationId() + " " + raw.getPeople();
        assertEquals("kim 1 2", observed);
        Observations.record("mb-camel-case", observed);
    }
}
