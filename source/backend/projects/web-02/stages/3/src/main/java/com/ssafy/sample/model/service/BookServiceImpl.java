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
    // BookService의 다섯 메서드를 직접 구현하세요. 요구사항 R-LAYER를 참고합니다.
    // study-target:svc-methods:end
}
