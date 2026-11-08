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
    // study-target:ctrl-dispatch:end

    // study-target:ctrl-list:start
    private void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Gear> list = service.____();
        request.____("list", list);
        forward(request, response, "____");
    }
    // study-target:ctrl-list:end

    // study-target:ctrl-regist:start
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
    // study-target:ctrl-regist:end

    // study-target:ctrl-detail:start
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
    // study-target:ctrl-detail:end

    // study-target:ctrl-login:start
    private void login(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/login-form.jsp");
            return;
        }
        Member member = service.____(request.getParameter("email"), request.getParameter("pass"));
        if (member == null) {
            request.setAttribute("alertMsg", "이메일 또는 비밀번호를 확인한 뒤 다시 시도하세요.");
            forward(request, response, "/login-form.jsp");
            return;
        }
        request.getSession().____("user", member);
        redirect(request, response, "____");
    }
    // study-target:ctrl-login:end

    // study-target:ctrl-logout:start
    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(____);
        if (session != null) {
            session.____();
        }
        redirect(request, response, "/");
    }
    // study-target:ctrl-logout:end
}
