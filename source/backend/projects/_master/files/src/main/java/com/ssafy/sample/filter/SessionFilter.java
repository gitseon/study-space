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

/** /gear 요청만 보호합니다. 로그인은 /user가 처리하므로 이 필터에 걸리지 않습니다. */
@WebFilter("/gear")
public class SessionFilter extends HttpFilter {
    private static final long serialVersionUID = 1L;

    //@@target filter-session
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        HttpSession session = req.getSession(false);
        Object user = (session == null) ? null : session.getAttribute("user");
        if (user != null) {
            chain.doFilter(request, response);
        } else {
            res.sendRedirect(req.getContextPath() + "/user?action=login");
        }
    }
    //@@stage 1
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        HttpSession session = req.getSession(____);
        Object user = (session == null) ? null : session.getAttribute("____");
        if (user != null) {
            chain.____(request, response);
        } else {
            res.sendRedirect(req.getContextPath() + "/user?action=login");
        }
    }
    //@@stage 2
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // TODO: 세션을 새로 만들지 않고 가져와 "user" 속성이 있으면 다음 단계로 넘기세요.
        // 없으면 /user?action=login으로 redirect합니다. 컨텍스트 경로를 포함합니다.
    }
    //@@stage 3
    // doFilter 메서드를 직접 작성하세요. 요구사항 R-FILTER를 참고합니다.
    //@@end
}
