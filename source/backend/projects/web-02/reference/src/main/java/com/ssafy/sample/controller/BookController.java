package com.ssafy.sample.controller;

import java.io.IOException;
import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;
import com.ssafy.sample.model.service.BookService;
import com.ssafy.sample.model.service.BookServiceImpl;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

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
        List<Book> list = service.selectAll();
        request.setAttribute("list", list);
        forward(request, response, "/book/list.jsp");
    }

    private void regist(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            forward(request, response, "/book/regist.jsp");
            return;
        }
        Book book = new Book();
        book.setCode(request.getParameter("code"));
        book.setName(request.getParameter("name"));
        book.setAuthor(request.getParameter("author"));
        book.setCategory(request.getParameter("category"));
        try {
            book.setPrice(Integer.parseInt(request.getParameter("price")));
        } catch (NumberFormatException e) {
            request.setAttribute("alertMsg", "가격은 숫자로 입력하세요.");
            forward(request, response, "/book/regist.jsp");
            return;
        }
        if (service.insert(book) == 0) {
            request.setAttribute("alertMsg", "등록하지 못했습니다. 이미 있는 코드인지 확인하세요.");
            forward(request, response, "/book/regist.jsp");
            return;
        }
        redirect(request, response, "/book?action=list");
    }

    private void detail(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String code = request.getParameter("code");
        Book book = code == null ? null : service.detail(code);
        if (book == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        request.setAttribute("book", book);
        forward(request, response, "/book/detail.jsp");
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
        // maxAge의 단위는 초입니다. 60초 * 60분 * 24시간 * 365일 = 31,536,000초이고 이것이 1년입니다.
        int oneYear = 60 * 60 * 24 * 365;
        if ("on".equals(request.getParameter("remember-me"))) {
            setupCookie("email", email, oneYear, path, response);
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
