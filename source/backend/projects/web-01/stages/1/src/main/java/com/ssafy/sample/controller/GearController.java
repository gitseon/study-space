package com.ssafy.sample.controller;

import java.io.IOException;
import java.util.List;

import com.ssafy.sample.model.dto.Gear;
import com.ssafy.sample.model.service.DuplicateCodeException;
import com.ssafy.sample.model.service.GearService;
import com.ssafy.sample.model.service.GearServiceImpl;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
        case "delete":
            delete(request, response);
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
        String code = request.getParameter("code");
        String name = request.getParameter("name");
        String brand = request.getParameter("brand");
        String color = request.getParameter("color");
        int price = parseNonNegativeInt(request.getParameter("____"));
        if (!hasText(code, 30) || !hasText(name, 50) || price < 0 || !hasText(brand, 30) || !hasText(color, 30)) {
            request.setAttribute("alertMsg", "모든 항목을 입력하고 가격은 0 이상의 정수로 입력하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        Gear gear = new Gear(code.trim(), name.trim(), price, brand.trim(), color.trim());
        try {
            service.____(gear);
        } catch (____ e) {
            request.setAttribute("alertMsg", "이미 등록된 코드입니다. 다른 코드를 입력하세요.");
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
        Gear gear = hasText(code, 30) ? service.____(code) : null;
        if (gear == null) {
            response.sendError(HttpServletResponse.____);
            return;
        }
        request.setAttribute("____", gear);
        forward(request, response, "/gear/detail.jsp");
    }
    // study-target:ctrl-detail:end

    // study-target:ctrl-delete:start
    private void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (!"____".equalsIgnoreCase(request.getMethod())) {
            response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            return;
        }
        String code = request.getParameter("code");
        int deleted = hasText(code, 30) ? service.____(code) : 0;
        if (deleted == 0) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        redirect(request, response, "/gear?action=____");
    }
    // study-target:ctrl-delete:end
}
