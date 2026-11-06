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
        // TODO: action 값에 따라 list, regist, detail, delete 메서드를 호출하세요.
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
        // POST 요청이면 code, name, price, brand, color를 읽어 검증합니다.
        //  - 검증 실패: request 속성 alertMsg에 안내를 담고 등록 화면으로 forward
        //  - 코드 중복(DuplicateCodeException): 안내 후 등록 화면으로 forward
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

    // study-target:ctrl-delete:start
    private void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: POST 요청일 때만 삭제합니다. 다른 방식은 405로 응답하세요.
        // 삭제된 행이 없으면 404로 응답하고 삭제에 성공하면 /gear?action=list로 redirect합니다.
    }
    // study-target:ctrl-delete:end
}
