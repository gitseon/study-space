package study.springcheck.di;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.NoUniqueBeanDefinitionException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.UnsatisfiedDependencyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DiTests {
    interface Discount {
        String name();
    }

    @Component
    @Primary
    static class RateDiscount implements Discount {
        public String name() {
            return "rate";
        }
    }

    @Component
    static class FixedDiscount implements Discount {
        public String name() {
            return "fixed";
        }
    }

    @Component
    static class ByPrimary {
        final Discount discount;

        ByPrimary(Discount discount) {
            this.discount = discount;
        }
    }

    @Component
    static class ByQualifier {
        final Discount discount;

        ByQualifier(@Qualifier("diTests.FixedDiscount") Discount discount) {
            this.discount = discount;
        }
    }

    @Component
    static class ByList {
        final List<Discount> all;

        ByList(List<Discount> all) {
            this.all = all;
        }
    }

    @Test
    void primaryQualifierAndList() {
        try (var ctx = new AnnotationConfigApplicationContext(RateDiscount.class, FixedDiscount.class, ByPrimary.class, ByQualifier.class, ByList.class)) {
            String primary = ctx.getBean(ByPrimary.class).discount.name();
            String qualifier = ctx.getBean(ByQualifier.class).discount.name();
            int count = ctx.getBean(ByList.class).all.size();
            assertEquals("rate", primary);
            assertEquals("fixed", qualifier);
            assertEquals(2, count);
            Observations.record("di-primary", primary);
            Observations.record("di-qualifier-over-primary", qualifier);
            Observations.record("di-list-count", String.valueOf(count));
        }
    }

    interface Notifier {
        String name();
    }

    @Component("mailNotifier")
    static class MailNotifier implements Notifier {
        public String name() {
            return "mail";
        }
    }

    @Component("smsNotifier")
    static class SmsNotifier implements Notifier {
        public String name() {
            return "sms";
        }
    }

    @Component
    static class Ambiguous {
        Ambiguous(Notifier notifier) {
        }
    }

    @Component
    static class ByName {
        final Notifier notifier;

        ByName(Notifier smsNotifier) {
            this.notifier = smsNotifier;
        }
    }

    @Test
    void twoCandidatesWithoutHintFailAtStartup() {
        UnsatisfiedDependencyException error = assertThrows(UnsatisfiedDependencyException.class,
                () -> new AnnotationConfigApplicationContext(MailNotifier.class, SmsNotifier.class, Ambiguous.class).close());
        assertEquals(NoUniqueBeanDefinitionException.class, error.getCause().getClass());
        Observations.record("di-ambiguous", error.getCause().getClass().getSimpleName());
    }

    @Test
    void parameterNameSelectsTheBeanWithThatName() {
        try (var ctx = new AnnotationConfigApplicationContext(MailNotifier.class, SmsNotifier.class, ByName.class)) {
            String picked = ctx.getBean(ByName.class).notifier.name();
            assertEquals("sms", picked);
            Observations.record("di-by-name", picked);
        }
    }

    @Component
    static class Counter {
    }

    @Component
    @Scope("prototype")
    static class Ticket {
    }

    @Component
    static class Desk {
        final Ticket injected;
        final ObjectProvider<Ticket> provider;

        Desk(Ticket injected, ObjectProvider<Ticket> provider) {
            this.injected = injected;
            this.provider = provider;
        }
    }

    @Test
    void scopes() {
        try (var ctx = new AnnotationConfigApplicationContext(Counter.class, Ticket.class, Desk.class)) {
            boolean singletonSame = ctx.getBean(Counter.class) == ctx.getBean(Counter.class);
            boolean prototypeSame = ctx.getBean(Ticket.class) == ctx.getBean(Ticket.class);
            Desk desk = ctx.getBean(Desk.class);
            boolean injectedSame = ctx.getBean(Desk.class).injected == desk.injected;
            boolean providerSame = desk.provider.getObject() == desk.provider.getObject();
            String observed = singletonSame + " " + prototypeSame + " " + injectedSame + " " + providerSame;
            assertEquals("true false true false", observed);
            Observations.record("di-scopes", observed);
        }
    }

    static final List<String> EVENTS = new ArrayList<>();

    @Component
    static class Helper {
    }

    @Component
    static class Lifecycle {
        @Autowired
        Helper helper;

        Lifecycle() {
            EVENTS.add("constructor:" + (helper == null ? "null" : "set"));
        }

        @PostConstruct
        void init() {
            EVENTS.add("postConstruct:" + (helper == null ? "null" : "set"));
        }

        @PreDestroy
        void close() {
            EVENTS.add("preDestroy");
        }
    }

    @Component
    @Scope("prototype")
    static class ProtoLifecycle {
        @PostConstruct
        void init() {
            EVENTS.add("proto-postConstruct");
        }

        @PreDestroy
        void close() {
            EVENTS.add("proto-preDestroy");
        }
    }

    @Test
    void lifecycleOrder() {
        EVENTS.clear();
        try (var ctx = new AnnotationConfigApplicationContext(Helper.class, Lifecycle.class, ProtoLifecycle.class)) {
            ctx.getBean(ProtoLifecycle.class);
            EVENTS.add("use");
        }
        String observed = String.join(" ", EVENTS);
        assertEquals("constructor:null postConstruct:set proto-postConstruct use preDestroy", observed);
        Observations.record("di-lifecycle", observed);
    }

    static class Clock {
    }

    @Configuration
    static class ClockConfig {
        @Bean
        Clock studyClock() {
            return new Clock();
        }
    }

    @Component
    static class RoomPolicy {
    }

    @Test
    void beanNames() {
        try (var ctx = new AnnotationConfigApplicationContext()) {
            ctx.register(ClockConfig.class);
            ctx.scan("study.springcheck.di.named");
            ctx.refresh();
            String byMethod = ctx.getBeanNamesForType(Clock.class)[0];
            String byClass = ctx.getBeanNamesForType(study.springcheck.di.named.RoomPolicy.class)[0];
            assertEquals("studyClock", byMethod);
            assertEquals("roomPolicy", byClass);
            Observations.record("di-bean-names", byMethod + " " + byClass);
        }
    }

    @Component
    static class A {
        A(B b) {
        }
    }

    @Component
    static class B {
        B(A a) {
        }
    }

    @Test
    void constructorCycleFailsAtStartup() {
        assertThrows(UnsatisfiedDependencyException.class, () -> new AnnotationConfigApplicationContext(A.class, B.class).close());
        Observations.record("di-cycle", "startup-failure");
    }

    @Component
    static class WithDefault {
        final int openHour;

        WithDefault(@Value("${room.open-hour:8}") int openHour) {
            this.openHour = openHour;
        }
    }

    @Component
    static class WithoutDefault {
        WithoutDefault(@Value("${room.close-hour}") int closeHour) {
        }
    }

    @Test
    void valueDefaults() {
        try (var ctx = new AnnotationConfigApplicationContext(WithDefault.class)) {
            assertEquals(8, ctx.getBean(WithDefault.class).openHour);
        }
        assertThrows(Exception.class, () -> new AnnotationConfigApplicationContext(WithoutDefault.class).close());
        Observations.record("config-value-default", "8 startup-failure");
    }

    @Test
    void scanCoversTheBasePackageAndBelowOnly() {
        try (var ctx = new AnnotationConfigApplicationContext()) {
            ctx.scan("study.springcheck.di.named");
            ctx.refresh();
            boolean inside = ctx.getBeanNamesForType(study.springcheck.di.named.RoomPolicy.class).length == 1;
            boolean below = ctx.getBeanNamesForType(study.springcheck.di.named.sub.SeatPolicy.class).length == 1;
            boolean outside = ctx.getBeanNamesForType(study.springcheck.di.other.GuestPolicy.class).length == 1;
            assertEquals("true true false", inside + " " + below + " " + outside);
            Observations.record("config-scan-range", inside + " " + below + " " + outside);
        }
    }
}
