package study.springcheck.more;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.MethodName.class)
class JunitLifecycleTests {
    static final List<String> EVENTS = new ArrayList<>();

    @BeforeEach
    void before() {
        EVENTS.add("before");
    }

    @AfterEach
    void after() {
        EVENTS.add("after");
    }

    @Test
    void a() {
        EVENTS.add("a");
    }

    @Test
    void b() {
        EVENTS.add("b");
    }

    @AfterAll
    static void record() {
        String observed = String.join(" ", EVENTS);
        assertEquals("before a after before b after", observed);
        Observations.record("junit-lifecycle", observed);
    }
}
