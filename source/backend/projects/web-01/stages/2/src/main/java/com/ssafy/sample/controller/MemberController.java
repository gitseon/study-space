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
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 로그인 화면(/login-form.jsp)으로 forward하세요.
        // POST 요청이면 email, pass 파라미터로 로그인합니다.
        //  - 실패: request 속성 alertMsg에 안내를 담고 로그인 화면으로 forward
        //  - 성공: 세션 ID를 바꾼 뒤 세션 속성 "user"에 회원을 저장
        //  - remember-me가 "on"이면 email 쿠키를 저장하고 아니면 같은 path로 삭제
        //  - 성공하면 /gear?action=list로 redirect
    }
    // study-target:user-login:end

    // study-target:user-logout:start
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // TODO: 세션이 있으면 무효화하고 메인(/)으로 redirect하세요. 세션을 새로 만들지 않습니다.
    }
    // study-target:user-logout:end
}
