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

    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Gear> list = service.selectAll();
        request.setAttribute("list", list);
        forward(request, response, "/gear/list.jsp");
    }

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
        if ("on".equals(request.getParameter("remember-me"))) {
            setupCookie("email", email, 60 * 60 * 24 * 30, path, response);
        } else {
            setupCookie("email", "", 0, path, response);
        }
        redirect(request, response, "/");
    }

    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        redirect(request, response, "/");
    }
}
