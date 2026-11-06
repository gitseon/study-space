package com.ssafy.sample.filter;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/** /book 요청만 보호합니다. 로그인은 /user가 처리하므로 이 필터에 걸리지 않습니다. */
@WebFilter("/book")
public class SessionFilter extends HttpFilter {
    private static final long serialVersionUID = 1L;

    // study-target:filter-session:start
    // doFilter 메서드를 직접 작성하세요. 요구사항 R-FILTER를 참고합니다.
    // study-target:filter-session:end
}
