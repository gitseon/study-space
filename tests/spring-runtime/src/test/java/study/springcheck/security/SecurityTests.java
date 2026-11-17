package study.springcheck.security;

import java.util.List;

import jakarta.servlet.http.HttpSession;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockServletContext;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import study.springcheck.Observations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

class SecurityTests {
    @RestController
    public static class Pages {
        static int calls;

        @GetMapping({"/", "/admin", "/admin/reports/daily", "/me", "/open/info", "/api/items"})
        public String page() {
            calls++;
            return "ok";
        }

        @PostMapping({"/me/rentals", "/api/items"})
        public String change() {
            calls++;
            return "changed";
        }

        @GetMapping("/whoami")
        public String whoami(@AuthenticationPrincipal UserDetails user) {
            return user.getUsername() + " " + user.getAuthorities();
        }
    }

    @Configuration
    @EnableWebMvc
    public static class WebConfig implements WebMvcConfigurer {
        @Bean
        Pages pages() {
            return new Pages();
        }

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**").allowedOrigins("http://localhost:5173").allowedMethods("GET", "POST");
        }
    }

    @Configuration
    public static class Users {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        UserDetailsService userDetailsService(PasswordEncoder encoder) {
            String userHash = encoder.encode("pw-user");
            String adminHash = encoder.encode("pw-admin");
            return username -> {
                if (username.equals("mina")) {
                    return User.withUsername("mina").password(userHash).roles("USER").build();
                }
                if (username.equals("root")) {
                    return User.withUsername("root").password(adminHash).roles("ADMIN").build();
                }
                throw new UsernameNotFoundException(username);
            };
        }
    }

    /** Form login, rules from narrow to wide. */
    @Configuration
    @EnableWebSecurity
    public static class FormConfig {
        @Bean
        SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/", "/open/**").permitAll()
                    .requestMatchers("/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated())
                    .formLogin(form -> form.defaultSuccessUrl("/"))
                    .logout(logout -> logout.logoutSuccessUrl("/"));
            return http.build();
        }
    }

    /** The wide rule first: everything below it is never reached. */
    @Configuration
    @EnableWebSecurity
    public static class WideFirstConfig {
        @Bean
        SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/**").permitAll()
                    .requestMatchers("/admin/**").hasRole("ADMIN"));
            return http.build();
        }
    }

    /** REST style: 401 instead of a redirect to the login page. */
    @Configuration
    @EnableWebSecurity
    public static class ApiConfig {
        @Bean
        SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                    .anyRequest().authenticated())
                    .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
            return http.build();
        }
    }

    private MockMvc mvc(Class<?> securityConfig) {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.setServletContext(new MockServletContext());
        ctx.register(WebConfig.class, Users.class, securityConfig);
        ctx.refresh();
        return MockMvcBuilders.webAppContextSetup(ctx).apply(springSecurity()).build();
    }

    private String outcome(MockMvc mvc, RequestBuilder request) throws Exception {
        MvcResult result = mvc.perform(request).andReturn();
        String location = result.getResponse().getRedirectedUrl();
        return result.getResponse().getStatus() + (location == null ? "" : "->" + location);
    }

    @Test
    void formLoginRules() throws Exception {
        MockMvc mvc = mvc(FormConfig.class);
        Pages.calls = 0;
        String anonymousProtected = outcome(mvc, get("/me"));
        int callsAfterAnonymous = Pages.calls;
        String anonymousOpen = outcome(mvc, get("/open/info"));
        String userAdmin = outcome(mvc, get("/admin/reports/daily").with(user("mina").roles("USER")));
        String adminAdmin = outcome(mvc, get("/admin/reports/daily").with(user("root").roles("ADMIN")));
        String adminRoot = outcome(mvc, get("/admin").with(user("mina").roles("USER")));
        String authorityOnly = outcome(mvc, get("/admin").with(user("x").authorities(new SimpleGrantedAuthority("ADMIN"))));
        String observed = anonymousProtected + " " + anonymousOpen + " " + userAdmin + " " + adminAdmin + " " + adminRoot + " " + authorityOnly;
        assertEquals("302->/login 200 403 200 403 403", observed);
        assertEquals(0, callsAfterAnonymous);
        Observations.record("sec-form-rules", observed);
        Observations.record("sec-blocked-before-controller", "controllerCalls=" + callsAfterAnonymous);
    }

    @Test
    void wideRuleFirstOpensEverything() throws Exception {
        String observed = outcome(mvc(WideFirstConfig.class), get("/admin/reports/daily"));
        assertEquals("200", observed);
        Observations.record("sec-wide-first", observed);
    }

    @Test
    void apiEntryPointAnswers401And403() throws Exception {
        MockMvc mvc = mvc(ApiConfig.class);
        String observed = outcome(mvc, get("/me")) + " " + outcome(mvc, get("/admin").with(user("mina").roles("USER"))) + " "
                + outcome(mvc, get("/admin").with(user("root").roles("ADMIN")));
        assertEquals("401 403 200", observed);
        Observations.record("sec-api-401-403", observed);
    }

    @Test
    void csrfProtectsChangingRequests() throws Exception {
        MockMvc mvc = mvc(FormConfig.class);
        String observed = outcome(mvc, post("/me/rentals").with(user("mina").roles("USER"))) + " "
                + outcome(mvc, post("/me/rentals").with(user("mina").roles("USER")).with(csrf())) + " "
                + outcome(mvc, get("/me").with(user("mina").roles("USER")));
        assertEquals("403 200 200", observed);
        Observations.record("sec-csrf", observed);
    }

    @Test
    void loginAndLogout() throws Exception {
        MockMvc mvc = mvc(FormConfig.class);
        String success = outcome(mvc, formLogin().user("mina").password("pw-user"));
        String wrongPassword = outcome(mvc, formLogin().user("mina").password("nope"));
        String unknownUser = outcome(mvc, formLogin().user("ghost").password("pw-user"));
        String getLogin = outcome(mvc, post("/login").param("username", "mina").param("password", "pw-user"));
        MvcResult login = mvc.perform(formLogin().user("mina").password("pw-user")).andReturn();
        HttpSession session = login.getRequest().getSession(false);
        String me = outcome(mvc, get("/me").session((MockHttpSession) session));
        String logoutNoToken = outcome(mvc, post("/logout").session((MockHttpSession) session));
        String logout = outcome(mvc, post("/logout").session((MockHttpSession) session).with(csrf()));
        String observed = success + " " + wrongPassword + " " + unknownUser + " " + getLogin + " " + me + " " + logoutNoToken + " " + logout;
        assertEquals("302->/ 302->/login?error 302->/login?error 403 200 403 302->/", observed);
        Observations.record("sec-login-logout", observed);
        String who = mvc.perform(get("/whoami").session((MockHttpSession) mvc.perform(formLogin().user("root").password("pw-admin")).andReturn().getRequest().getSession(false)))
                .andReturn().getResponse().getContentAsString();
        assertEquals("root [ROLE_ADMIN]", who);
        Observations.record("sec-principal", who);
    }

    @Test
    void logoutWithoutTokenKeepsTheSession() throws Exception {
        MockMvc mvc = mvc(FormConfig.class);
        MockHttpSession session = (MockHttpSession) mvc.perform(formLogin().user("mina").password("pw-user")).andReturn().getRequest().getSession(false);
        String rejected = outcome(mvc, post("/logout").session(session));
        String stillIn = outcome(mvc, get("/me").session(session));
        assertEquals("403 200", rejected + " " + stillIn);
        Observations.record("sec-logout-without-token", rejected + " " + stillIn);
    }

    @Test
    void bcryptAndRoles() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String first = encoder.encode("study1234");
        String second = encoder.encode("study1234");
        assertNotEquals(first, second);
        assertTrue(encoder.matches("study1234", first) && encoder.matches("study1234", second));
        List<String> authorities = User.withUsername("a").password("x").roles("ADMIN").build().getAuthorities().stream().map(Object::toString).toList();
        assertEquals(List.of("ROLE_ADMIN"), authorities);
        Observations.record("sec-bcrypt-roles", "different-hashes matches=true " + authorities);
    }

    @Test
    void corsPreflight() throws Exception {
        MockMvc mvc = mvc(WideFirstConfig.class);
        MvcResult allowed = mvc.perform(options("/api/items").header("Origin", "http://localhost:5173").header("Access-Control-Request-Method", "POST")).andReturn();
        MvcResult denied = mvc.perform(options("/api/items").header("Origin", "http://other.example").header("Access-Control-Request-Method", "POST")).andReturn();
        MvcResult noOrigin = mvc.perform(get("/api/items")).andReturn();
        String observed = allowed.getResponse().getStatus() + " " + allowed.getResponse().getHeader("Access-Control-Allow-Origin") + " / "
                + denied.getResponse().getStatus() + " " + denied.getResponse().getHeader("Access-Control-Allow-Origin") + " / " + noOrigin.getResponse().getStatus();
        assertEquals("200 http://localhost:5173 / 403 null / 200", observed);
        Observations.record("rest-cors", observed);
    }
}
