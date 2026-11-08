package com.ssafy.sample.controller;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** 제공 코드입니다. 수정하지 않습니다. action이 없으면 "list"로 간주합니다. */
public interface ControllerHelper {
    default String getActionParameter(HttpServletRequest request, HttpServletResponse response) {
        String action = request.getParameter("action");
        if (action == null || action.isBlank()) {
            action = "list";
        }
        return action;
    }

    default void redirect(HttpServletRequest request, HttpServletResponse response, String path) throws IOException {
        response.sendRedirect(request.getContextPath() + path);
    }

    default void forward(HttpServletRequest request, HttpServletResponse response, String path)
            throws ServletException, IOException {
        RequestDispatcher dispatcher = request.getRequestDispatcher(path);
        dispatcher.forward(request, response);
    }

    /** 쿠키를 저장하거나 삭제합니다. 삭제할 때는 저장할 때와 같은 이름과 path를 쓰고 maxAge를 0으로 둡니다. */
    default void setupCookie(String name, String value, int maxAge, String path, HttpServletResponse response) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath(path);
        response.addCookie(cookie);
    }
}
