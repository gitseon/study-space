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
        case "delete":
            delete(request, response);
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
        case "delete":
            delete(request, response);
            break;
        default:
            response.sendError(HttpServletResponse.____);
        }
    }
    //@@stage 2
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: action 값에 따라 list, regist, detail, delete 메서드를 호출하세요.
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
        String code = request.getParameter("code");
        String name = request.getParameter("name");
        String brand = request.getParameter("brand");
        String color = request.getParameter("color");
        int price = parseNonNegativeInt(request.getParameter("price"));
        if (!hasText(code, 30) || !hasText(name, 50) || price < 0 || !hasText(brand, 30) || !hasText(color, 30)) {
            request.setAttribute("alertMsg", "모든 항목을 입력하고 가격은 0 이상의 정수로 입력하세요.");
            forward(request, response, "/gear/regist.jsp");
            return;
        }
        Gear gear = new Gear(code.trim(), name.trim(), price, brand.trim(), color.trim());
        try {
            service.insert(gear);
        } catch (DuplicateCodeException e) {
            request.setAttribute("alertMsg", "이미 등록된 코드입니다. 다른 코드를 입력하세요.");
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
    //@@stage 2
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 등록 화면(/gear/regist.jsp)으로 forward하세요.
        // POST 요청이면 code, name, price, brand, color를 읽어 검증합니다.
        //  - 검증 실패: request 속성 alertMsg에 안내를 담고 등록 화면으로 forward
        //  - 코드 중복(DuplicateCodeException): 안내 후 등록 화면으로 forward
        //  - 성공: 저장 후 /gear?action=list로 redirect
    }
    //@@stage 3
    // regist 메서드를 직접 작성하세요. 요구사항 R-REGIST를 참고합니다.
    //@@end

    //@@target ctrl-detail
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String code = request.getParameter("code");
        Gear gear = hasText(code, 30) ? service.detail(code) : null;
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
        Gear gear = hasText(code, 30) ? service.____(code) : null;
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

    //@@target ctrl-delete
    private void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            return;
        }
        String code = request.getParameter("code");
        int deleted = hasText(code, 30) ? service.delete(code) : 0;
        if (deleted == 0) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        redirect(request, response, "/gear?action=list");
    }
    //@@stage 1
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
    //@@stage 2
    private void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: POST 요청일 때만 삭제합니다. 다른 방식은 405로 응답하세요.
        // 삭제된 행이 없으면 404로 응답하고 삭제에 성공하면 /gear?action=list로 redirect합니다.
    }
    //@@stage 3
    // delete 메서드를 직접 작성하세요. 요구사항 R-DELETE를 참고합니다.
    //@@end
}
