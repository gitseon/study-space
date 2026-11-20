package study.practice.notice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import study.practice.notice.model.Notice;
import study.practice.notice.persistence.NoticeDao;
import study.practice.notice.service.NoticeService;
import study.practice.notice.service.NoticeServiceImpl;
import study.practice.notice.web.InvalidNoticeException;

@SpringBootTest
@AutoConfigureMockMvc
class NoticePracticeTests {
    private static final String ROUTE = "/practice/notices";
    private static final String TITLE_ERROR = "제목을 입력하세요.";

    @Autowired
    private NoticeDao dao;
    @Autowired
    private NoticeService service;
    @Autowired
    private MockMvc mvc;

    @Test
    void dtoProvidesTheDeclaredFieldsAndConstructionOptions() {
        Notice notice = new Notice(8, 2, 1, "안내", "본문", 0, false, "ACTIVE", "2026-01-01");
        assertEquals(9, Arrays.stream(Notice.class.getDeclaredFields()).filter(field -> !field.isSynthetic()).count());
        assertEquals(8, notice.getNoticeId());
        assertFalse(notice.isPinned());
        Notice blank = new Notice();
        blank.setPinned(true);
        assertTrue(blank.isPinned());
        assertEquals("ACTIVE", draft("제목").getStatus());
    }

    @Test
    void mapperListsByIdAndReadsTheBooleanColumn() {
        List<Notice> rows = dao.selectAll();
        assertEquals(List.of(1, 2, 3, 4), rows.stream().limit(4).map(Notice::getNoticeId).toList());
        assertTrue(rows.get(0).isPinned());
        assertFalse(rows.get(1).isPinned());
        assertEquals("HIDDEN", rows.get(3).getStatus());
    }

    @Test
    @Transactional
    void insertWritesTheGeneratedKeyBackAndUsesDatabaseDefaults() {
        Notice notice = draft(UUID.randomUUID().toString());
        notice.setPinned(true);
        assertEquals(1, dao.insert(notice));
        assertTrue(notice.getNoticeId() > 4);
        Notice stored = dao.selectAll().stream()
                .filter(row -> row.getNoticeId() == notice.getNoticeId()).findFirst().orElseThrow();
        assertEquals(notice.getTitle(), stored.getTitle());
        assertFalse(stored.isPinned());
        assertEquals(0, stored.getViewCount());
        assertEquals("ACTIVE", stored.getStatus());
    }

    @Test
    void serviceListsNoticesInAReadOnlyTransaction() throws NoSuchMethodException {
        assertTrue(NoticeServiceImpl.class.getMethod("getAllNotices")
                .getAnnotation(Transactional.class).readOnly());
        assertEquals(1, service.getAllNotices().getFirst().getNoticeId());
    }

    @Test
    void serviceRejectsMissingAndBlankTitlesBeforeWriting() {
        for (Notice invalid : List.of(draft(null), draft("  "))) {
            InvalidNoticeException error = assertThrows(InvalidNoticeException.class,
                    () -> service.createNotice(invalid));
            assertEquals(TITLE_ERROR, error.getMessage());
            assertEquals(0, invalid.getNoticeId());
        }
    }

    @Test
    void serviceRollsBackEvenWhenTheFailureFollowsTheInsert() {
        Notice notice = draft("rollback-" + UUID.randomUUID());
        assertThrows(RuntimeException.class, () -> service.createNotice(notice));
        assertTrue(notice.getNoticeId() > 4);
        assertTrue(dao.selectAll().stream().noneMatch(row -> row.getNoticeId() == notice.getNoticeId()));
    }

    @Test
    void getReturnsJsonAndTheEndpointAppearsInOpenApi() throws Exception {
        mvc.perform(get(ROUTE)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].noticeId").value(1))
                .andExpect(jsonPath("$[0].pinned").value(true));
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk())
                .andExpect(jsonPath("$.paths['" + ROUTE + "'].post").exists());
    }

    @Test
    @Transactional
    void postReportsCreationAndReturnsProblemDetailsWhenTheTitleIsMissing() throws Exception {
        int before = dao.selectAll().size();
        mvc.perform(post(ROUTE).contentType(MediaType.APPLICATION_JSON).content("""
                {"noticeId": 0, "categoryId": 1, "authorId": 2, "title": "사용 안내",
                 "content": "새 운영 안내입니다.", "viewCount": 0, "pinned": false}
                """))
                .andExpect(status().isCreated())
                .andExpect(content().string("Notice Created"));
        mvc.perform(post(ROUTE).contentType(MediaType.APPLICATION_JSON).content("""
                {"noticeId": 0, "categoryId": 1, "authorId": 2,
                 "content": "제목이 없는 요청입니다.", "viewCount": 0, "pinned": false}
                """))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value(TITLE_ERROR));
        assertEquals(before + 1, dao.selectAll().size());
    }

    private Notice draft(String title) {
        return Notice.builder().categoryId(1).authorId(2).title(title).content("연습 본문").build();
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class RollbackFixture {
        @Bean
        FailureAfterInsert failureAfterInsert() {
            return new FailureAfterInsert();
        }
    }

    @Intercepts(@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}))
    static class FailureAfterInsert implements Interceptor {
        @Override
        public Object intercept(Invocation invocation) throws Throwable {
            Object result = invocation.proceed();
            if (invocation.getArgs()[1] instanceof Notice notice && notice.getTitle().startsWith("rollback-")) {
                throw new IllegalStateException("테스트에서 INSERT 뒤 발생시킨 예외");
            }
            return result;
        }
    }
}
