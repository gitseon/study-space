package com.ssafy.sample.model.service;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

import com.ssafy.sample.model.dao.BookDao;
import com.ssafy.sample.model.dao.BookDaoImpl;
import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;

public class BookServiceImpl implements BookService {

    private BookServiceImpl() {
    }

    private final BookDao dao = BookDaoImpl.getInstance();
    private static final BookService instance = new BookServiceImpl();

    public static BookService getInstance() {
        return instance;
    }

    // study-target:svc-methods:start
    @Override
    public Member login(String email, String password) {
        try {
            return dao.____(email, password);
        } catch (SQLException e) {
            throw new IllegalStateException("로그인 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public List<Book> selectAll() {
        try {
            return dao.selectAll();
        } catch (SQLException e) {
            throw new IllegalStateException("도서 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public int insert(Book book) {
        try {
            return dao.insert(book);
        } catch (____ e) {
            return 0;
        } catch (SQLException e) {
            throw new IllegalStateException("도서 등록 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public Book detail(String code) {
        try {
            return dao.____(code);
        } catch (SQLException e) {
            throw new IllegalStateException("도서 상세 조회 중 오류가 발생했습니다.", e);
        }
    }
    // study-target:svc-methods:end
}
