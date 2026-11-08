package com.ssafy.sample.model.service;

import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;

/** 제공 코드입니다. 수정하지 않습니다. */
public interface BookService {
    Member login(String email, String password);

    List<Book> selectAll();

    /** 저장한 행 수를 반환합니다. 코드가 이미 있어 저장하지 못하면 0입니다. */
    int insert(Book book);

    Book detail(String code);
}
