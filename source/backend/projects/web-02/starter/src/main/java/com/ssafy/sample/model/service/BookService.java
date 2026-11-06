package com.ssafy.sample.model.service;

import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;

/** 제공 코드입니다. 수정하지 않습니다. */
public interface BookService {
    Member login(String email, String password);

    List<Book> selectAll();

    /** 코드가 이미 있으면 DuplicateCodeException을 던집니다. */
    int insert(Book book);

    Book detail(String code);

    /** 삭제된 행 수를 반환합니다. 없는 코드는 0입니다. */
    int delete(String code);
}
