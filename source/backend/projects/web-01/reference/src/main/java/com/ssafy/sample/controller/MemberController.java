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

    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/login-form.jsp");
            return;
        }
        String email = request.getParameter("email");
        String pass = request.getParameter("pass");
        Member member = service.login(email, pass);
        if (member == null) {
            request.setAttribute("alertMsg", "이메일 또는 비밀번호를 확인한 뒤 다시 시도하세요.");
            forward(request, response, "/login-form.jsp");
            return;
        }
        HttpSession session = request.getSession();
        request.changeSessionId();
        session.setAttribute("user", member);

        String path = cookiePath(request);
        if ("on".equals(request.getParameter("remember-me"))) {
            setupCookie("email", email, 60 * 60 * 24 * 30, path, response);
        } else {
            setupCookie("email", "", 0, path, response);
        }
        redirect(request, response, "/gear?action=list");
    }

    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        redirect(request, response, "/");
    }
}
