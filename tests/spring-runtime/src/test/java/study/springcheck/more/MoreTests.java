package study.springcheck.more;

import java.util.ArrayList;
import java.util.List;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import org.junit.jupiter.api.Test;
import org.opentest4j.AssertionFailedError;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.RestController;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

class MoreTests {
    // ---- settings: src/test/resources/application.properties holds room.open-hour=9

    @Configuration
    @EnableConfigurationProperties(RoomProps.class)
    public static class PropsApp {
    }

    @ConfigurationProperties(prefix = "room")
    public static class RoomProps {
        private int openHour;

        public int getOpenHour() {
            return openHour;
        }

        public void setOpenHour(int openHour) {
            this.openHour = openHour;
        }
    }

    private int openHour(String... args) {
        SpringApplication app = new SpringApplication(PropsApp.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        try (ConfigurableApplicationContext ctx = app.run(args)) {
            return ctx.getBean(RoomProps.class).getOpenHour();
        }
    }

    @Test
    void commandLineBeatsTheSettingsFileAndNamesAreBoundRelaxed() {
        int fromFile = openHour();
        int fromArgument = openHour("--room.open-hour=10");
        assertEquals("9 10", fromFile + " " + fromArgument);
        Observations.record("config-precedence", fromFile + " " + fromArgument);
        Observations.record("config-relaxed-binding", "open-hour->openHour=" + fromFile);
    }

    // ---- JUnit

    @Test
    void assertEqualsReportsExpectedFirst() {
        AssertionFailedError error = assertThrows(AssertionFailedError.class, () -> assertEquals(2, 3));
        assertEquals("expected: <2> but was: <3>", error.getMessage());
        Observations.record("junit-assert-message", error.getMessage());
    }

    // ---- Lombok

    @RequiredArgsConstructor
    static class Svc {
        final String name;
        final int count;
        String memo;
    }

    @RequiredArgsConstructor
    static class WithNonNull {
        final String name;
        @NonNull String owner;
        String memo;
    }

    @Test
    void requiredArgsConstructorTakesFinalAndNonNullFields() {
        int finalOnly = Svc.class.getDeclaredConstructors()[0].getParameterCount();
        int withNonNull = WithNonNull.class.getDeclaredConstructors()[0].getParameterCount();
        assertEquals("2 2", finalOnly + " " + withNonNull);
        Observations.record("lombok-required-args", finalOnly + " " + withNonNull);
    }

    // ---- DI

    @Component
    static class Repo {
    }

    @Component
    static class OneConstructor {
        final Repo repo;

        OneConstructor(Repo repo) {
            this.repo = repo;
        }
    }

    @Component
    static class TwoConstructors {
        Repo repo;

        TwoConstructors() {
        }

        TwoConstructors(Repo repo) {
            this.repo = repo;
        }
    }

    @Test
    void singleConstructorNeedsNoAutowiredAndTwoUseTheDefaultOne() {
        try (var ctx = new AnnotationConfigApplicationContext(Repo.class, OneConstructor.class, TwoConstructors.class)) {
            String observed = (ctx.getBean(OneConstructor.class).repo != null) + " " + (ctx.getBean(TwoConstructors.class).repo != null);
            assertEquals("true false", observed);
            Observations.record("di-single-constructor", observed);
        }
    }

    static class First {
    }

    static class Second {
        final First first;

        Second(First first) {
            this.first = first;
        }
    }

    @Configuration
    static class FullConfig {
        @Bean
        First first() {
            return new First();
        }

        @Bean
        Second second() {
            return new Second(first());
        }
    }

    @Configuration(proxyBeanMethods = false)
    static class LiteConfig {
        @Bean
        First first() {
            return new First();
        }

        @Bean
        Second second() {
            return new Second(first());
        }
    }

    @Test
    void callingABeanMethodInsideConfigurationReturnsTheSingleton() {
        boolean full;
        boolean lite;
        try (var ctx = new AnnotationConfigApplicationContext(FullConfig.class)) {
            full = ctx.getBean(Second.class).first == ctx.getBean(First.class);
        }
        try (var ctx = new AnnotationConfigApplicationContext(LiteConfig.class)) {
            lite = ctx.getBean(Second.class).first == ctx.getBean(First.class);
        }
        assertEquals("true false", full + " " + lite);
        Observations.record("di-configuration-proxy", full + " " + lite);
    }

    // ---- Boot auto configuration backs off

    public record ClockInfo(String source) {
    }

    @org.springframework.boot.autoconfigure.AutoConfiguration
    public static class ClockAutoConfiguration {
        @Bean
        @ConditionalOnMissingBean
        ClockInfo clockInfo() {
            return new ClockInfo("auto");
        }
    }

    @Configuration
    public static class UserClockConfiguration {
        @Bean
        ClockInfo myClock() {
            return new ClockInfo("user");
        }
    }

    @Test
    void autoConfigurationBacksOffWhenTheUserDefinesTheBean() {
        String[] seen = new String[2];
        new ApplicationContextRunner().withConfiguration(AutoConfigurations.of(ClockAutoConfiguration.class))
                .run(ctx -> seen[0] = ctx.getBean(ClockInfo.class).source());
        new ApplicationContextRunner().withUserConfiguration(UserClockConfiguration.class).withConfiguration(AutoConfigurations.of(ClockAutoConfiguration.class))
                .run(ctx -> seen[1] = ctx.getBean(ClockInfo.class).source() + ":" + ctx.getBeansOfType(ClockInfo.class).size());
        assertEquals("auto user:1", seen[0] + " " + seen[1]);
        Observations.record("boot-autoconfig-backoff", seen[0] + " " + seen[1]);
    }

    // ---- logging

    @Test
    void logLevelFiltersLowerLevels() {
        Logger logger = (Logger) LoggerFactory.getLogger("study.room.level-check");
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);
        logger.setAdditive(false);
        logger.setLevel(Level.INFO);
        logger.trace("t");
        logger.debug("d");
        logger.info("i");
        logger.warn("w");
        logger.error("e");
        String printed = String.join(" ", appender.list.stream().map(e -> e.getLevel().toString()).toList());
        assertEquals("INFO WARN ERROR", printed);
        Observations.record("logging-level-filter", printed);
        Observations.record("logging-implementation", logger.getClass().getName());
    }

    // ---- MVC forward and redirect

    @Controller
    public static class MoveController {
        @GetMapping("/go-forward")
        public String forward() {
            return "forward:/rooms/list";
        }

        @GetMapping("/go-redirect")
        public String redirect() {
            return "redirect:/rooms/list";
        }
    }

    @Test
    void forwardKeepsTheRequestAndRedirectStartsANewOne() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new MoveController()).build();
        MvcResult forward = mvc.perform(get("/go-forward")).andReturn();
        MvcResult redirect = mvc.perform(get("/go-redirect")).andReturn();
        String observed = forward.getResponse().getStatus() + " " + forward.getResponse().getForwardedUrl() + " / "
                + redirect.getResponse().getStatus() + " " + redirect.getResponse().getRedirectedUrl();
        assertEquals("200 /rooms/list / 302 /rooms/list", observed);
        Observations.record("mvc-forward-redirect", observed);
    }

    // ---- REST error contract

    static class RentalNotFound extends RuntimeException {
        RentalNotFound(String message) {
            super(message);
        }
    }

    public record ErrorResponse(String code, String message) {
    }

    @RestController
    public static class RentalLookup {
        @GetMapping("/api/rentals/9")
        public String one() {
            throw new RentalNotFound("대여 9를 찾을 수 없습니다");
        }
    }

    @RestControllerAdvice
    public static class ApiAdvice {
        @ExceptionHandler(RentalNotFound.class)
        public ResponseEntity<ErrorResponse> notFound(RentalNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("RENTAL_NOT_FOUND", e.getMessage()));
        }
    }

    @Test
    void restErrorsAreJsonWithTheMatchingStatus() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new RentalLookup()).setControllerAdvice(new ApiAdvice()).build();
        MvcResult result = mvc.perform(get("/api/rentals/9")).andReturn();
        String type = result.getResponse().getContentType();
        String body = result.getResponse().getContentAsString();
        assertEquals(404, result.getResponse().getStatus());
        assertEquals(true, MediaType.APPLICATION_JSON.isCompatibleWith(MediaType.parseMediaType(type)));
        assertEquals(true, body.contains("\"code\":\"RENTAL_NOT_FOUND\""));
        Observations.record("rest-error-json", "404 application/json code=RENTAL_NOT_FOUND");
    }

    // ---- unused import guard for ControllerAdvice/ResponseBody used by other classes
    @ControllerAdvice
    static class Unused {
        @ResponseBody
        String none() {
            return "";
        }
    }

    static List<String> unusedList() {
        return new ArrayList<>();
    }
}
