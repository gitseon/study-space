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

    /** 컨텍스트 루트가 비어 있으면 "/"를 반환합니다. */
    default String cookiePath(HttpServletRequest request) {
        String contextPath = request.getContextPath();
        return contextPath.isEmpty() ? "/" : contextPath;
    }

    /** 값이 null이 아니고 공백만이 아니며 길이가 maxLength 이하이면 true입니다. */
    default boolean hasText(String value, int maxLength) {
        return value != null && !value.isBlank() && value.trim().length() <= maxLength;
    }

    /** 0 이상의 정수 문자열이면 그 값을, 비어 있거나 숫자가 아니거나 범위를 벗어나면 -1을 반환합니다. */
    default int parseNonNegativeInt(String text) {
        if (text == null) {
            return -1;
        }
        try {
            int value = Integer.parseInt(text.trim());
            return value < 0 ? -1 : value;
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}
