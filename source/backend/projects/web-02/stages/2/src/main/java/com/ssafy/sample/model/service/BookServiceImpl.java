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
        // TODO: dao.login을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return null;
    }

    @Override
    public List<Book> selectAll() {
        // TODO: dao.selectAll을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return List.of();
    }

    @Override
    public int insert(Book book) {
        // TODO: dao.insert를 호출하세요.
        // 중복 키(SQLIntegrityConstraintViolationException)는 저장하지 못한 것이므로 0을 반환합니다.
        // 그 밖의 SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return 0;
    }

    @Override
    public Book detail(String code) {
        // TODO: dao.detail을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return null;
    }
    // study-target:svc-methods:end
}
