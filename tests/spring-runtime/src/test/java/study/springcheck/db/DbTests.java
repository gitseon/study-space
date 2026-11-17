package study.springcheck.db;

import java.io.IOException;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.IllegalTransactionStateException;
import org.springframework.transaction.UnexpectedRollbackException;

import study.springcheck.Observations;
import study.springcheck.db.DbApp.Reservation;
import study.springcheck.db.DbApp.Room;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(classes = DbApp.class, properties = {
        "spring.main.web-application-type=none",
        "spring.datasource.url=${SPRING_VERIFY_DB_URL}",
        "spring.datasource.username=${SPRING_VERIFY_DB_USER}",
        "spring.datasource.password=${SPRING_VERIFY_DB_PASSWORD}",
        "mybatis.mapper-locations=classpath:mapper/*.xml"})
class DbTests {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    DbApp.ReservationMapper mapper;
    @Autowired
    DbApp.TxService tx;
    @Autowired
    DbApp.LogService logs;

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

    private String ids(List<Reservation> rows) {
        return rows.stream().map(r -> String.valueOf(r.getReservationId())).toList().toString();
    }

    @Test
    void mapperIsAProxyWithoutAnImplementationClass() {
        String observed = (java.lang.reflect.Proxy.isProxyClass(mapper.getClass()) || AopUtils.isAopProxy(mapper)) + " " + mapper.count();
        assertEquals("true 3", observed);
        Observations.record("mb-mapper-proxy", observed);
    }

    @Test
    void dynamicWhere() {
        String observed = ids(mapper.search(null, null)) + " " + ids(mapper.search(1, null)) + " " + ids(mapper.search(null, "kim")) + " "
                + ids(mapper.search(1, "kim")) + " " + ids(mapper.search(null, "")) + " " + ids(mapper.search(9, null));
        assertEquals("[1, 2, 3] [1, 2] [1, 3] [1] [1, 2, 3] []", observed);
        Observations.record("mb-dynamic-where", observed);
    }

    @Test
    void hashBindsAndDollarSubstitutes() {
        String attack = "x' OR '1'='1";
        String observed = mapper.byNameUnsafe(attack).size() + " " + mapper.byNameSafe(attack).size() + " " + mapper.byNameSafe("kim").size();
        assertEquals("3 0 1", observed);
        Observations.record("mb-hash-vs-dollar", observed);
    }

    @Test
    void columnNamesMustMatchProperties() {
        Reservation raw = mapper.findRaw(1);
        Reservation aliased = mapper.findAliased(1);
        String observed = raw.getMemberName() + " " + raw.getReservationId() + " " + raw.getPeople() + " / " + aliased.getMemberName() + " " + aliased.getReservationId()
                + " / " + (mapper.findRaw(99) == null) + " " + mapper.search(9, null).size();
        assertEquals("null null 2 / kim 1 / true 0", observed);
        Observations.record("mb-column-mapping", observed);
    }

    @Test
    void foreachAndEmptyList() {
        String found = ids(mapper.findByIds(List.of(1, 3)));
        assertEquals("[1, 3]", found);
        assertThrows(BadSqlGrammarException.class, () -> mapper.findByIds(List.of()));
        Observations.record("mb-foreach", found + " empty=BadSqlGrammarException");
    }

    @Test
    void parameterNamesWithoutParam() {
        String observed = ids(mapper.twoParams(1, 4));
        assertEquals("[2]", observed);
        Observations.record("mb-two-params-no-annotation", observed);
    }

    @Test
    void generatedKeyAndAffectedRows() {
        Reservation r = new Reservation();
        r.setRoomId(3);
        r.setMemberName("park");
        r.setPeople(1);
        int affected = mapper.insert(r);
        String observed = affected + " " + r.getReservationId();
        assertEquals("1 4", observed);
        Observations.record("mb-generated-key", observed);
    }

    @Test
    void setTag() {
        int one = mapper.updateDynamic(1, null, 6);
        String people = String.valueOf(mapper.findAliased(1).getPeople());
        assertThrows(BadSqlGrammarException.class, () -> mapper.updateDynamic(1, null, null));
        String observed = one + " people=" + people + " none=BadSqlGrammarException";
        assertEquals("1 people=6 none=BadSqlGrammarException", observed);
        Observations.record("mb-set", observed);
    }

    @Test
    void collectionGroupsRowsByParentId() {
        Room one = mapper.roomWithReservations(1);
        Room empty = mapper.roomWithReservations(3);
        int flat = mapper.roomsFlat(1).size();
        String observed = one.getRoomName() + ":" + one.getReservations().size() + " " + empty.getRoomName() + ":" + empty.getReservations().size() + " flat=" + flat;
        assertEquals("A:2 C:0 flat=2", observed);
        Observations.record("mb-collection", observed);
    }

    private int rows() {
        return mapper.count();
    }

    @Test
    void rollbackRules() {
        assertThrows(IllegalStateException.class, tx::runtime);
        int afterRuntime = rows();
        assertThrows(IOException.class, tx::checked);
        int afterChecked = rows();
        assertThrows(IOException.class, tx::checkedRollbackFor);
        int afterRollbackFor = rows();
        tx.caught();
        int afterCaught = rows();
        String observed = afterRuntime + " " + afterChecked + " " + afterRollbackFor + " " + afterCaught;
        assertEquals("3 4 4 5", observed);
        Observations.record("tx-rollback-rules", observed);
    }

    @Test
    void selfInvocationRunsWithoutATransaction() {
        assertThrows(IllegalStateException.class, tx::outerSelf);
        int afterSelf = rows();
        assertThrows(IllegalStateException.class, tx::innerTx);
        int afterDirect = rows();
        String observed = afterSelf + " " + afterDirect;
        assertEquals("4 4", observed);
        Observations.record("tx-self-invocation", observed);
    }

    @Test
    void requiresNewSurvivesTheOuterRollback() {
        assertThrows(IllegalStateException.class, tx::outerWithLog);
        String observed = rows() + " logs=" + mapper.countLogs();
        assertEquals("3 logs=1", observed);
        Observations.record("tx-requires-new", observed);
    }

    @Test
    void innerRequiredFailureMarksTheWholeTransaction() {
        assertThrows(UnexpectedRollbackException.class, tx::outerCatchesInner);
        String observed = "UnexpectedRollbackException " + rows() + " logs=" + mapper.countLogs();
        assertEquals("UnexpectedRollbackException 3 logs=0", observed);
        Observations.record("tx-required-inner-failure", observed);
    }

    @Test
    void mandatoryNeedsAnExistingTransaction() {
        assertThrows(IllegalTransactionStateException.class, logs::mandatory);
        Observations.record("tx-mandatory", "IllegalTransactionStateException logs=" + mapper.countLogs());
    }

    @Test
    void readOnlyIsRecordedNotAsserted() {
        String outcome;
        try {
            tx.readOnlyInsert();
            outcome = "no-exception rows=" + rows();
        } catch (Exception e) {
            outcome = e.getClass().getSimpleName() + " rows=" + rows();
        }
        Observations.record("tx-readonly-observed", outcome);
    }
}
