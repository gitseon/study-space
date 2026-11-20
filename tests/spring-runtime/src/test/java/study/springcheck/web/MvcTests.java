package study.springcheck.web;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import org.junit.jupiter.api.Test;
import org.springframework.boot.servlet.autoconfigure.MultipartProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Controller;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

class MvcTests {
    static final List<String> LOG = new ArrayList<>();

    public static class RoomForm {
        private String name;
        private Integer floor;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getFloor() {
            return floor;
        }

        public void setFloor(Integer floor) {
            this.floor = floor;
        }
    }

    @Controller
    @RequestMapping("/rooms")
    public static class RoomController {
        @GetMapping
        public String list(@RequestParam int page, Model model) {
            model.addAttribute("page", page);
            return "room/list";
        }

        @GetMapping("/search")
        public String search(@RequestParam(required = false) String keyword, @RequestParam(defaultValue = "1") int page, Model model) {
            model.addAttribute("keyword", keyword);
            model.addAttribute("page", page);
            return "room/list";
        }

        @GetMapping("/{roomId}")
        public String detail(@PathVariable int roomId, Model model) {
            model.addAttribute("roomId", roomId);
            return "room/detail";
        }

        @PostMapping
        public String create(RoomForm form, RedirectAttributes attrs) {
            attrs.addFlashAttribute("message", "saved");
            attrs.addAttribute("floor", 3);
            return "redirect:/rooms/done";
        }

        @GetMapping("/form")
        public String form(RoomForm form) {
            return "room/form";
        }
    }

    private int status(MockMvc mvc, org.springframework.test.web.servlet.RequestBuilder request) throws Exception {
        return mvc.perform(request).andReturn().getResponse().getStatus();
    }

    @Test
    void bindingAndMappingStatuses() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new RoomController()).build();
        int missing = status(mvc, get("/rooms"));
        int mismatch = status(mvc, get("/rooms").param("page", "abc"));
        int ok = status(mvc, get("/rooms").param("page", "2"));
        int optional = status(mvc, get("/rooms/search"));
        int wrongMethod = status(mvc, delete("/rooms"));
        int unknown = status(mvc, get("/nowhere"));
        int pathMismatch = status(mvc, get("/rooms/abc"));
        String observed = missing + " " + mismatch + " " + ok + " " + optional + " " + wrongMethod + " " + unknown + " " + pathMismatch;
        assertEquals("400 400 200 200 405 404 400", observed);
        Observations.record("mvc-statuses", observed);
        MvcResult search = mvc.perform(get("/rooms/search")).andReturn();
        String defaults = search.getModelAndView().getModel().get("keyword") + " " + search.getModelAndView().getModel().get("page");
        assertEquals("null 1", defaults);
        Observations.record("mvc-optional-defaults", defaults);
        MvcResult detail = mvc.perform(get("/rooms/7")).andReturn();
        Observations.record("mvc-class-method-path", detail.getModelAndView().getViewName() + " " + detail.getModelAndView().getModel().get("roomId"));
    }

    @Test
    void redirectFlashAndModelAttribute() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new RoomController()).build();
        MvcResult result = mvc.perform(post("/rooms").param("name", "A")).andReturn();
        String observed = result.getResponse().getStatus() + " " + result.getResponse().getRedirectedUrl() + " flash=" + result.getFlashMap().get("message");
        assertEquals("302 /rooms/done?floor=3 flash=saved", observed);
        Observations.record("mvc-redirect", observed);
        MvcResult form = mvc.perform(get("/rooms/form")).andReturn();
        RoomForm bound = (RoomForm) form.getModelAndView().getModel().get("roomForm");
        String model = form.getResponse().getStatus() + " " + (bound != null) + " " + bound.getName() + " " + bound.getFloor();
        assertEquals("200 true null null", model);
        Observations.record("mvc-model-attribute", model);
    }

    static class NamedInterceptor implements HandlerInterceptor {
        private final String name;
        private final boolean pass;

        NamedInterceptor(String name, boolean pass) {
            this.name = name;
            this.pass = pass;
        }

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            LOG.add("pre" + name);
            return pass;
        }

        @Override
        public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav) {
            LOG.add("post" + name);
        }

        @Override
        public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
            LOG.add("after" + name);
        }
    }

    @Controller
    public static class PingController {
        @GetMapping("/ping")
        @ResponseBody
        public String ping() {
            LOG.add("handler");
            return "pong";
        }

        @GetMapping("/fail")
        @ResponseBody
        public String fail() {
            LOG.add("handler");
            throw new IllegalStateException("fail");
        }
    }

    @Test
    void interceptorOrder() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new PingController())
                .addInterceptors(new NamedInterceptor("1", true), new NamedInterceptor("2", true)).build();
        LOG.clear();
        mvc.perform(get("/ping"));
        String normal = String.join(" ", LOG);
        LOG.clear();
        try {
            mvc.perform(get("/fail"));
        } catch (Exception expected) {
            LOG.add("exception");
        }
        String failed = String.join(" ", LOG);
        MockMvc blocked = MockMvcBuilders.standaloneSetup(new PingController())
                .addInterceptors(new NamedInterceptor("1", true), new NamedInterceptor("2", false), new NamedInterceptor("3", true)).build();
        LOG.clear();
        blocked.perform(get("/ping"));
        String stopped = String.join(" ", LOG);
        assertEquals("pre1 pre2 handler post2 post1 after2 after1", normal);
        assertEquals("pre1 pre2 handler after2 after1 exception", failed);
        assertEquals("pre1 pre2 after1", stopped);
        Observations.record("mvc-interceptor-normal", normal);
        Observations.record("mvc-interceptor-exception", failed);
        Observations.record("mvc-interceptor-blocked", stopped);
    }

    @Test
    void servletFilterWrapsMvcInterceptorsAndTheHandler() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new PingController())
                .addFilters((request, response, chain) -> {
                    LOG.add("filter-in");
                    chain.doFilter(request, response);
                    LOG.add("filter-out");
                })
                .addInterceptors(new NamedInterceptor("1", true))
                .build();
        LOG.clear();
        mvc.perform(get("/ping"));
        String observed = String.join(" ", LOG);
        assertEquals("filter-in pre1 handler post1 after1 filter-out", observed);
        Observations.record("mvc-filter-interceptor-order", observed);
    }

    @RestController
    public static class PingApi {
        @GetMapping("/api/ping")
        public String ping() {
            return "pong";
        }
    }

    @Test
    void controllerStringsUseViewResolutionOrResponseBody() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new RoomController(), new PingController(), new PingApi()).build();
        MvcResult page = mvc.perform(get("/rooms/8")).andReturn();
        MvcResult methodBody = mvc.perform(get("/ping")).andReturn();
        MvcResult classBody = mvc.perform(get("/api/ping")).andReturn();
        assertNull(methodBody.getModelAndView());
        assertNull(classBody.getModelAndView());
        String observed = page.getModelAndView().getViewName() + " "
                + methodBody.getResponse().getContentAsString() + " " + classBody.getResponse().getContentAsString();
        assertEquals("room/detail pong pong", observed);
        Observations.record("mvc-view-and-response-body", observed);
    }

    public static class ReserveForm {
        @NotBlank
        private String memberName;
        @Min(1)
        private int people;

        public String getMemberName() {
            return memberName;
        }

        public void setMemberName(String memberName) {
            this.memberName = memberName;
        }

        public int getPeople() {
            return people;
        }

        public void setPeople(int people) {
            this.people = people;
        }
    }

    @Controller
    public static class ReserveController {
        @PostMapping("/with-result")
        public String withResult(@Valid @ModelAttribute("form") ReserveForm form, BindingResult result) {
            LOG.add("handler:" + result.getErrorCount());
            return result.hasErrors() ? "reservation/form" : "redirect:/reservations";
        }

        @PostMapping("/without-result")
        public String withoutResult(@Valid @ModelAttribute("form") ReserveForm form) {
            LOG.add("handler");
            return "redirect:/reservations";
        }
    }

    @Test
    void validationWithAndWithoutBindingResult() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new ReserveController()).build();
        LOG.clear();
        MvcResult with = mvc.perform(post("/with-result").param("memberName", " ").param("people", "0")).andReturn();
        String first = with.getResponse().getStatus() + " " + with.getModelAndView().getViewName() + " " + String.join(",", LOG);
        LOG.clear();
        MvcResult without = mvc.perform(post("/without-result").param("memberName", " ").param("people", "0")).andReturn();
        String second = without.getResponse().getStatus() + " handlerCalls=" + LOG.size();
        assertEquals("200 reservation/form handler:2", first);
        assertEquals("400 handlerCalls=0", second);
        Observations.record("mvc-validation-with-result", first);
        Observations.record("mvc-validation-without-result", second);
    }

    static class RoomNotFound extends RuntimeException {
    }

    @Controller
    public static class LocalHandlerController {
        @GetMapping("/local")
        @ResponseBody
        public String local() {
            throw new RoomNotFound();
        }

        @ExceptionHandler(RuntimeException.class)
        @ResponseStatus(HttpStatus.CONFLICT)
        @ResponseBody
        public String handle() {
            return "local";
        }
    }

    @Controller
    public static class NoHandlerController {
        @GetMapping("/global")
        @ResponseBody
        public String global() {
            throw new RoomNotFound();
        }

        @GetMapping("/other")
        @ResponseBody
        public String other() {
            throw new IllegalArgumentException();
        }
    }

    @ControllerAdvice
    public static class GlobalAdvice {
        @ExceptionHandler(RoomNotFound.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        @ResponseBody
        public String notFound() {
            return "advice-specific";
        }

        @ExceptionHandler(RuntimeException.class)
        @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        @ResponseBody
        public String runtime() {
            return "advice-general";
        }
    }

    @Test
    void exceptionHandlerPrecedence() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new LocalHandlerController(), new NoHandlerController()).setControllerAdvice(new GlobalAdvice()).build();
        MvcResult local = mvc.perform(get("/local")).andReturn();
        MvcResult global = mvc.perform(get("/global")).andReturn();
        MvcResult other = mvc.perform(get("/other")).andReturn();
        String observed = local.getResponse().getStatus() + ":" + local.getResponse().getContentAsString() + " "
                + global.getResponse().getStatus() + ":" + global.getResponse().getContentAsString() + " "
                + other.getResponse().getStatus() + ":" + other.getResponse().getContentAsString();
        assertEquals("409:local 404:advice-specific 500:advice-general", observed);
        Observations.record("mvc-exception-precedence", observed);
    }

    public record RentalRequest(Integer equipmentId, Integer days) {
    }

    public record RentalResponse(int rentalId, int equipmentId) {
    }

    @RestController
    @RequestMapping("/api/rentals")
    public static class RentalApi {
        @PostMapping
        public ResponseEntity<RentalResponse> rent(@RequestBody RentalRequest request) {
            return ResponseEntity.created(URI.create("/api/rentals/12")).body(new RentalResponse(12, request.equipmentId()));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> giveBack(@PathVariable int id) {
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/{id}")
        public RentalResponse one(@PathVariable int id) {
            return new RentalResponse(id, 3);
        }
    }

    @Test
    void restStatusesAndBodies() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new RentalApi()).build();
        MvcResult created = mvc.perform(post("/api/rentals").contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":3,\"days\":2}")).andReturn();
        String observed = created.getResponse().getStatus() + " " + created.getResponse().getHeader("Location") + " " + created.getResponse().getContentAsString();
        assertEquals("201 /api/rentals/12 {\"equipmentId\":3,\"rentalId\":12}", observed.replace("{\"rentalId\":12,\"equipmentId\":3}", "{\"equipmentId\":3,\"rentalId\":12}"));
        Observations.record("rest-created", created.getResponse().getStatus() + " " + created.getResponse().getHeader("Location"));
        int form = status(mvc, post("/api/rentals").contentType(MediaType.APPLICATION_FORM_URLENCODED).content("equipmentId=3"));
        int broken = status(mvc, post("/api/rentals").contentType(MediaType.APPLICATION_JSON).content("{\"equipmentId\":"));
        int empty = status(mvc, post("/api/rentals").contentType(MediaType.APPLICATION_JSON));
        MvcResult deleted = mvc.perform(delete("/api/rentals/12")).andReturn();
        MvcResult one = mvc.perform(get("/api/rentals/12")).andReturn();
        String statuses = form + " " + broken + " " + empty + " " + deleted.getResponse().getStatus() + ":" + deleted.getResponse().getContentAsString().length()
                + " " + one.getResponse().getStatus() + " " + one.getResponse().getContentType();
        assertEquals("415 400 400 204:0 200 application/json", statuses);
        Observations.record("rest-body-statuses", statuses);
    }

    @Controller
    public static class UploadController {
        @PostMapping("/upload")
        @ResponseBody
        public String upload(@RequestParam("file") MultipartFile file) {
            return file.isEmpty() + " " + file.getOriginalFilename();
        }
    }

    @Test
    void multipartEmptyFileAndDefaults() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new UploadController()).build();
        String empty = mvc.perform(multipart("/upload").file(new MockMultipartFile("file", "", "application/octet-stream", new byte[0]))).andReturn().getResponse().getContentAsString();
        String filled = mvc.perform(multipart("/upload").file(new MockMultipartFile("file", "../a.txt", "text/plain", "x".getBytes()))).andReturn().getResponse().getContentAsString();
        MultipartProperties defaults = new MultipartProperties();
        String limits = defaults.getMaxFileSize().toMegabytes() + "MB " + defaults.getMaxRequestSize().toMegabytes() + "MB";
        assertEquals("true ", empty);
        assertEquals("false ../a.txt", filled);
        assertEquals("1MB 10MB", limits);
        Observations.record("mvc-multipart", empty.trim() + " / " + filled + " / " + limits);
    }
}
