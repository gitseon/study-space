package com.ssafy.sample.controller;

import java.io.IOException;

import com.ssafy.sample.model.dto.Member;
import com.ssafy.sample.model.service.GearService;
import com.ssafy.sample.model.service.GearServiceImpl;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/user")
public class MemberController extends HttpServlet implements ControllerHelper {
    private static final long serialVersionUID = 1L;

    private final GearService service = GearServiceImpl.getInstance();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        process(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        process(request, response);
    }

    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = getActionParameter(request, response);
        switch (action) {
        case "login":
            login(request, response);
            break;
        case "logout":
            logout(request, response);
            break;
        default:
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    // study-target:user-login:start
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    // study-target:user-login:end

    // study-target:user-logout:start
    // logout 메서드를 직접 작성하세요. 요구사항 R-LOGOUT을 참고합니다.
    // study-target:user-logout:end
}
