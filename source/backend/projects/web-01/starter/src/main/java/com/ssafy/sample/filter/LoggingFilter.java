package com.ssafy.sample.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;

/** 제공 코드입니다. 수정하지 않습니다. 비밀번호 파라미터는 값을 가려서 출력합니다. */
@WebFilter("/*")
public class LoggingFilter extends HttpFilter {
    private static final long serialVersionUID = 1L;
    private static final Set<String> SECRET_NAMES = Set.of("pass", "password");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("[요청 파라미터]");
        request.getParameterMap().forEach((name, values) -> {
            String shown = SECRET_NAMES.contains(name) ? "****" : Arrays.toString(values);
            System.out.printf("name: %s, value: %s%n", name, shown);
        });
        chain.doFilter(request, response);
    }
}
