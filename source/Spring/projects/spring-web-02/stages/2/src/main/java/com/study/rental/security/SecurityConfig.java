package com.study.rental.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    // study-target:sec-chain:start
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // TODO: 장비 목록 조회와 /login은 모두 허용하고 /api/admin/**은 ADMIN 역할만, 나머지는 인증된 사용자만 허용한다
        // TODO: form 로그인의 성공은 200, 실패는 401로 응답하고 로그아웃은 204로 응답한다
        // TODO: 인증되지 않은 요청은 로그인 화면으로 보내지 않고 401로 응답한다
        return http.build();
    }
    // study-target:sec-chain:end
}
