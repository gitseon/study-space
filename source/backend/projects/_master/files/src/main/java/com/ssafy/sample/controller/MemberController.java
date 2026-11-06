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

    //@@target user-login
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
    //@@stage 1
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
        session.____("user", member);

        String path = cookiePath(request);
        if ("on".equals(request.getParameter("____"))) {
            setupCookie("email", email, 60 * 60 * 24 * 30, path, response);
        } else {
            setupCookie("email", "", ____, path, response);
        }
        redirect(request, response, "/gear?action=list");
    }
    //@@stage 2
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 로그인 화면(/login-form.jsp)으로 forward하세요.
        // POST 요청이면 email, pass 파라미터로 로그인합니다.
        //  - 실패: request 속성 alertMsg에 안내를 담고 로그인 화면으로 forward
        //  - 성공: 세션 ID를 바꾼 뒤 세션 속성 "user"에 회원을 저장
        //  - remember-me가 "on"이면 email 쿠키를 저장하고 아니면 같은 path로 삭제
        //  - 성공하면 /gear?action=list로 redirect
    }
    //@@stage 3
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    //@@end

    //@@target user-logout
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        redirect(request, response, "/");
    }
    //@@stage 1
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(____);
        if (session != null) {
            session.____();
        }
        redirect(request, response, "/");
    }
    //@@stage 2
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // TODO: 세션이 있으면 무효화하고 메인(/)으로 redirect하세요. 세션을 새로 만들지 않습니다.
    }
    //@@stage 3
    // logout 메서드를 직접 작성하세요. 요구사항 R-LOGOUT을 참고합니다.
    //@@end
}
