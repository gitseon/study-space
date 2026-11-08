package com.ssafy.sample.controller;

import java.io.IOException;
import java.util.List;

import com.ssafy.sample.model.dto.Gear;
import com.ssafy.sample.model.dto.Member;
import com.ssafy.sample.model.service.GearService;
import com.ssafy.sample.model.service.GearServiceImpl;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/gear")
public class GearController extends HttpServlet implements ControllerHelper {
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

    // study-target:ctrl-dispatch:start
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: action 값에 따라 list, regist, detail, login, logout 메서드를 호출하세요.
        // 정의되지 않은 action은 404로 응답합니다.
    }
    // study-target:ctrl-dispatch:end

    // study-target:ctrl-list:start
    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: 서비스에서 목록을 가져와 request 속성 "list"에 담고 /gear/list.jsp로 forward하세요.
    }
    // study-target:ctrl-list:end

    // study-target:ctrl-regist:start
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 등록 화면(/gear/regist.jsp)으로 forward하세요.
        // POST 요청이면 code, name, price, brand, color를 읽어 Gear를 만듭니다.
        //  - 가격이 숫자가 아니면: request 속성 alertMsg에 안내를 담고 등록 화면으로 forward
        //  - 서비스 insert가 0을 반환하면(코드 중복): 안내를 담고 등록 화면으로 forward
        //  - 성공: 저장 후 /gear?action=list로 redirect
    }
    // study-target:ctrl-regist:end

    // study-target:ctrl-detail:start
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: code 파라미터로 용품을 조회해 request 속성 "gear"에 담고 /gear/detail.jsp로 forward하세요.
        // code가 없거나 해당 용품이 없으면 404로 응답합니다.
    }
    // study-target:ctrl-detail:end

    // study-target:ctrl-login:start
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 로그인 화면(/login-form.jsp)으로 forward하세요.
        // POST 요청이면 email, pass 파라미터로 서비스 login을 호출합니다.
        //  - 실패(null): request 속성 alertMsg에 안내를 담고 로그인 화면으로 forward
        //  - 성공: 세션 속성 "user"에 회원을 저장합니다.
        //    아이디 기억하기(remember-me)를 체크했으면 email 쿠키를 30일 동안 저장하고, 체크하지 않았으면 같은 path로 지웁니다.
        //    쿠키 저장과 삭제에는 ControllerHelper의 setupCookie를 씁니다. 끝나면 메인(/)으로 redirect
    }
    // study-target:ctrl-login:end

    // study-target:ctrl-logout:start
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // TODO: 세션이 있으면 무효화하고 메인(/)으로 redirect하세요. 세션을 새로 만들지 않습니다.
    }
    // study-target:ctrl-logout:end
}
