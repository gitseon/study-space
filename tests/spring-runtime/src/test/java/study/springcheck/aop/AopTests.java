package study.springcheck.aop;

import java.util.ArrayList;
import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Component;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AopTests {
    static final List<String> LOG = new ArrayList<>();

    @Configuration
    @EnableAspectJAutoProxy(proxyTargetClass = true)
    static class Config {
    }

    @Component
    public static class RoomService {
        public String findRoom(int id) {
            LOG.add("target");
            return "room" + id;
        }

        public String failRoom() {
            LOG.add("target");
            throw new IllegalStateException("boom");
        }
    }

    @Aspect
    @Component
    public static class OrderAspect {
        @Around("execution(* study.springcheck.aop.AopTests.RoomService.*(..))")
        public Object around(ProceedingJoinPoint pjp) throws Throwable {
            LOG.add("around-before");
            try {
                return pjp.proceed();
            } finally {
                LOG.add("around-after");
            }
        }

        @Before("execution(* study.springcheck.aop.AopTests.RoomService.*(..))")
        public void before() {
            LOG.add("before");
        }

        @AfterReturning("execution(* study.springcheck.aop.AopTests.RoomService.*(..))")
        public void afterReturning() {
            LOG.add("afterReturning");
        }

        @AfterThrowing("execution(* study.springcheck.aop.AopTests.RoomService.*(..))")
        public void afterThrowing() {
            LOG.add("afterThrowing");
        }

        @After("execution(* study.springcheck.aop.AopTests.RoomService.*(..))")
        public void after() {
            LOG.add("after");
        }
    }

    @Test
    void adviceOrderInOneAspect() {
        try (var ctx = new AnnotationConfigApplicationContext(Config.class, RoomService.class, OrderAspect.class)) {
            RoomService service = ctx.getBean(RoomService.class);
            LOG.clear();
            service.findRoom(1);
            String normal = String.join(" ", LOG);
            LOG.clear();
            assertThrows(IllegalStateException.class, service::failRoom);
            String failed = String.join(" ", LOG);
            assertEquals("around-before before target afterReturning after around-after", normal);
            assertEquals("around-before before target afterThrowing after around-after", failed);
            Observations.record("aop-order-normal", normal);
            Observations.record("aop-order-exception", failed);
            Observations.record("aop-proxy-kind", AopUtils.isCglibProxy(service) ? "cglib" : "other");
            Observations.record("aop-afterthrowing-propagates", "IllegalStateException");
        }
    }

    @Component
    public static class ReportService {
        public void daily() {
            LOG.add("daily");
            summarize();
        }

        public void summarize() {
            LOG.add("summarize");
        }
    }

    @Aspect
    @Component
    public static class SummarizeAspect {
        @Before("execution(* study.springcheck.aop.AopTests.ReportService.summarize(..))")
        public void before() {
            LOG.add("advice");
        }
    }

    @Test
    void selfInvocationSkipsTheAdvice() {
        try (var ctx = new AnnotationConfigApplicationContext(Config.class, ReportService.class, SummarizeAspect.class)) {
            ReportService service = ctx.getBean(ReportService.class);
            LOG.clear();
            service.daily();
            String inner = String.join(" ", LOG);
            LOG.clear();
            service.summarize();
            String outer = String.join(" ", LOG);
            assertEquals("daily summarize", inner);
            assertEquals("advice summarize", outer);
            Observations.record("aop-self-invocation", inner + " / " + outer);
        }
    }

    @Component
    public static class PriceService {
        public Integer price() {
            LOG.add("target");
            return 5000;
        }
    }

    @Aspect
    @Component
    public static class NoProceedAspect {
        @Around("execution(* study.springcheck.aop.AopTests.PriceService.price(..))")
        public Object around(ProceedingJoinPoint pjp) {
            LOG.add("around");
            return null;
        }
    }

    @Test
    void aroundWithoutProceedSkipsTheTarget() {
        try (var ctx = new AnnotationConfigApplicationContext(Config.class, PriceService.class, NoProceedAspect.class)) {
            LOG.clear();
            Integer result = ctx.getBean(PriceService.class).price();
            String observed = String.join(" ", LOG) + " -> " + result;
            assertEquals("around -> null", observed);
            Observations.record("aop-no-proceed", observed);
        }
    }

    @Component
    public static class SeatService {
        public void findSeat(int id) {
        }

        public void findAll() {
        }

        public void save(String name) {
        }

        public void findByNameAndFloor(String name, int floor) {
        }
    }

    @Component
    public static class SeatHelper {
        public void findSeat(int id) {
        }
    }

    @Aspect
    @Component
    public static class MatchAspect {
        @Before("execution(* study.springcheck.aop..*Service.find*(*))")
        public void one(org.aspectj.lang.JoinPoint jp) {
            LOG.add("one:" + jp.getSignature().getDeclaringType().getSimpleName() + "." + jp.getSignature().getName());
        }

        @Before("execution(* study.springcheck.aop..*Service.find*(..))")
        public void any(org.aspectj.lang.JoinPoint jp) {
            LOG.add("any:" + jp.getSignature().getDeclaringType().getSimpleName() + "." + jp.getSignature().getName());
        }
    }

    @Test
    void pointcutMatching() {
        try (var ctx = new AnnotationConfigApplicationContext(Config.class, SeatService.class, SeatHelper.class, MatchAspect.class)) {
            SeatService service = ctx.getBean(SeatService.class);
            LOG.clear();
            service.findSeat(1);
            service.findAll();
            service.save("a");
            service.findByNameAndFloor("a", 2);
            ctx.getBean(SeatHelper.class).findSeat(1);
            long one = LOG.stream().filter(s -> s.startsWith("one:")).count();
            long any = LOG.stream().filter(s -> s.startsWith("any:")).count();
            assertEquals(1, one);
            assertEquals(3, any);
            Observations.record("aop-pointcut-match", "one=" + one + " any=" + any);
        }
    }
}
