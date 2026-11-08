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
    // doGet과 doPost가 호출하는 process(request, response) 메서드를 직접 작성하세요.
    // 요구사항 R-LAYER를 참고합니다.
    // study-target:ctrl-dispatch:end

    // study-target:ctrl-list:start
    // list 메서드를 직접 작성하세요. 요구사항 R-LIST를 참고합니다.
    // study-target:ctrl-list:end

    // study-target:ctrl-regist:start
    // regist 메서드를 직접 작성하세요. 요구사항 R-REGIST를 참고합니다.
    // study-target:ctrl-regist:end

    // study-target:ctrl-detail:start
    // detail 메서드를 직접 작성하세요. 요구사항 R-DETAIL을 참고합니다.
    // study-target:ctrl-detail:end

    // study-target:ctrl-login:start
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    // study-target:ctrl-login:end

    // study-target:ctrl-logout:start
    // logout 메서드를 직접 작성하세요. 요구사항 R-LOGOUT을 참고합니다.
    // study-target:ctrl-logout:end
}
