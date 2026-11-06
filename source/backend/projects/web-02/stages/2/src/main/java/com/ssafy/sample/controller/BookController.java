package com.ssafy.sample.controller;

import java.io.IOException;
import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.service.DuplicateCodeException;
import com.ssafy.sample.model.service.BookService;
import com.ssafy.sample.model.service.BookServiceImpl;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/book")
public class BookController extends HttpServlet implements ControllerHelper {
    private static final long serialVersionUID = 1L;

    private final BookService service = BookServiceImpl.getInstance();

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
        // TODO: 서비스에서 목록을 가져와 request 속성 "list"에 담고 /book/list.jsp로 forward하세요.
    }
    // study-target:ctrl-list:end

    // study-target:ctrl-regist:start
    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: GET 요청이면 등록 화면(/book/regist.jsp)으로 forward하세요.
        // POST 요청이면 code, name, price, author, category를 읽어 검증합니다.
        //  - 검증 실패: request 속성 alertMsg에 안내를 담고 등록 화면으로 forward
        //  - 코드 중복(DuplicateCodeException): 안내 후 등록 화면으로 forward
        //  - 성공: 저장 후 /book?action=list로 redirect
    }
    // study-target:ctrl-regist:end

    // study-target:ctrl-detail:start
    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: code 파라미터로 도서를 조회해 request 속성 "book"에 담고 /book/detail.jsp로 forward하세요.
        // code가 없거나 해당 도서가 없으면 404로 응답합니다.
    }
    // study-target:ctrl-detail:end

    // study-target:ctrl-delete:start
    private void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO: POST 요청일 때만 삭제합니다. 다른 방식은 405로 응답하세요.
        // 삭제된 행이 없으면 404로 응답하고 삭제에 성공하면 /book?action=list로 redirect합니다.
    }
    // study-target:ctrl-delete:end
}
