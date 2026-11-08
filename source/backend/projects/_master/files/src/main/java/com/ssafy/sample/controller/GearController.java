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

    //@@target ctrl-dispatch
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = getActionParameter(request, response);
        switch (action) {
        case "list":
            list(request, response);
            break;
        case "regist":
            regist(request, response);
            break;
        case "detail":
            detail(request, response);
            break;
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
    //@@stage 1
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = getActionParameter(request, response);
        switch (____) {
        case "list":
            list(request, response);
            break;
        case "regist":
            ____(request, response);
            break;
        case "detail":
            detail(request, response);
            break;
        case "login":
            login(request, response);
            break;
        case "logout":
            ____(request, response);
            break;
        default:
            response.sendError(HttpServletResponse.____);
        }
    }
    //@@stage 2
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: action 값에 따라 list, regist, detail, login, logout 메서드를 호출하세요.
        // 정의되지 않은 action은 404로 응답합니다.
    }
    //@@stage 3
    // doGet과 doPost가 호출하는 process(request, response) 메서드를 직접 작성하세요.
    // 요구사항 R-LAYER를 참고합니다.
    //@@end

    //@@target ctrl-list
    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Gear> list = service.selectAll();
        request.setAttribute("list", list);
        forward(request, response, "/gear/list.jsp");
    }
    //@@stage 1
    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Gear> list = service.____();
        request.____("list", list);
        forward(request, response, "____");
    }
    //@@stage 2
    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: 서비스에서 목록을 가져와 request 속성 "list"에 담고 /gear/list.jsp로 forward하세요.
    }
    //@@stage 3
    // list 메서드를 직접 작성하세요. 요구사항 R-LIST를 참고합니다.
    //@@end

    //@@target ctrl-regist
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        Gear gear = new Gear();
        gear.setCode(request.getParameter("code"));
        gear.setName(request.getParameter("name"));
        gear.setBrand(request.getParameter("brand"));
        gear.setColor(request.getParameter("color"));
        try {
            gear.setPrice(Integer.parseInt(request.getParameter("price")));
        } catch (NumberFormatException e) {
            request.setAttribute("alertMsg", "가격은 숫자로 입력하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        if (service.insert(gear) == 0) {
            request.setAttribute("alertMsg", "등록하지 못했습니다. 이미 있는 코드인지 확인하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        redirect(request, response, "/gear?action=list");
    }
    //@@stage 1
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        Gear gear = new Gear();
        gear.setCode(request.getParameter("code"));
        gear.setName(request.getParameter("____"));
        gear.setBrand(request.getParameter("brand"));
        gear.setColor(request.getParameter("color"));
        try {
            gear.setPrice(Integer.____(request.getParameter("price")));
        } catch (____ e) {
            request.setAttribute("alertMsg", "가격은 숫자로 입력하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        if (service.____(gear) == 0) {
            request.setAttribute("alertMsg", "등록하지 못했습니다. 이미 있는 코드인지 확인하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        ____(request, response, "/gear?action=list");
    }
    //@@stage 2
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 등록 화면(/gear/regist.jsp)으로 forward하세요.
        // POST 요청이면 code, name, price, brand, color를 읽어 Gear를 만듭니다.
        //  - 가격이 숫자가 아니면: request 속성 alertMsg에 안내를 담고 등록 화면으로 forward
        //  - 서비스 insert가 0을 반환하면(코드 중복): 안내를 담고 등록 화면으로 forward
        //  - 성공: 저장 후 /gear?action=list로 redirect
    }
    //@@stage 3
    // regist 메서드를 직접 작성하세요. 요구사항 R-REGIST를 참고합니다.
    //@@end

    //@@target ctrl-detail
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String code = request.getParameter("code");
        Gear gear = code == null ? null : service.detail(code);
        if (gear == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        request.setAttribute("gear", gear);
        forward(request, response, "/gear/detail.jsp");
    }
    //@@stage 1
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String code = request.getParameter("code");
        Gear gear = code == null ? null : service.____(code);
        if (gear == null) {
            response.sendError(HttpServletResponse.____);
            return;
        }
        request.setAttribute("____", gear);
        forward(request, response, "/gear/detail.jsp");
    }
    //@@stage 2
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: code 파라미터로 용품을 조회해 request 속성 "gear"에 담고 /gear/detail.jsp로 forward하세요.
        // code가 없거나 해당 용품이 없으면 404로 응답합니다.
    }
    //@@stage 3
    // detail 메서드를 직접 작성하세요. 요구사항 R-DETAIL을 참고합니다.
    //@@end

    //@@target ctrl-login
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/login-form.jsp");
            return;
        }
        String email = request.getParameter("email");
        Member member = service.login(email, request.getParameter("pass"));
        if (member == null) {
            request.setAttribute("alertMsg", "이메일 또는 비밀번호를 확인한 뒤 다시 시도하세요.");
            forward(request, response, "/login-form.jsp");
            return;
        }
        request.getSession().setAttribute("user", member);
        // 쿠키는 저장할 때와 지울 때 이름과 path가 같아야 합니다. 루트 컨텍스트는 getContextPath()가 빈 문자열이라 "/"로 바꿉니다.
        String path = request.getContextPath().isEmpty() ? "/" : request.getContextPath();
        // maxAge의 단위는 초입니다. 60초 * 60분 * 24시간 * 365일 = 31,536,000초이고 이것이 1년입니다.
        int oneYear = 60 * 60 * 24 * 365;
        if ("on".equals(request.getParameter("remember-me"))) {
            setupCookie("email", email, oneYear, path, response);
        } else {
            setupCookie("email", "", 0, path, response);
        }
        redirect(request, response, "/");
    }
    //@@stage 1
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/login-form.jsp");
            return;
        }
        String email = request.getParameter("email");
        Member member = service.____(email, request.getParameter("pass"));
        if (member == null) {
            request.setAttribute("alertMsg", "이메일 또는 비밀번호를 확인한 뒤 다시 시도하세요.");
            forward(request, response, "/login-form.jsp");
            return;
        }
        request.getSession().____("user", member);
        String path = request.getContextPath().isEmpty() ? "____" : request.getContextPath();
        // maxAge의 단위는 초입니다. 60초 * 60분 * 24시간 * 365일 = 31,536,000초이고 이것이 1년입니다.
        int oneYear = 60 * 60 * 24 * 365;
        if ("on".equals(request.getParameter("____"))) {
            ____("email", email, oneYear, path, response);
        } else {
            setupCookie("email", "", ____, path, response);
        }
        redirect(request, response, "____");
    }
    //@@stage 2
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 로그인 화면(/login-form.jsp)으로 forward하세요.
        // POST 요청이면 email, pass 파라미터로 서비스 login을 호출합니다.
        //  - 실패(null): request 속성 alertMsg에 안내를 담고 로그인 화면으로 forward
        //  - 성공: 세션 속성 "user"에 회원을 저장합니다.
        //    아이디 기억하기(remember-me)를 체크했으면 email 쿠키를 1년 동안 저장하고, 체크하지 않았으면 같은 path로 지웁니다.
        //    쿠키 유효 기간(maxAge)의 단위는 초이므로 1년은 60 * 60 * 24 * 365초입니다.
        //    쿠키 저장과 삭제에는 ControllerHelper의 setupCookie를 씁니다. 끝나면 메인(/)으로 redirect
    }
    //@@stage 3
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    //@@end

    //@@target ctrl-logout
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
