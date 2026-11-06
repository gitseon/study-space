package com.ssafy.sample.model.dao;

import java.sql.SQLException;
import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;

/** 제공 코드입니다. 수정하지 않습니다. */
public interface BookDao {
    /** 이메일과 비밀번호가 모두 일치하는 회원을 반환하고 없으면 null을 반환합니다. */
    Member login(String email, String password) throws SQLException;

    /** 모든 도서를 코드 순서로 반환합니다. 없으면 빈 목록입니다. */
    List<Book> selectAll() throws SQLException;

    /** 도서 한 건을 추가하고 영향받은 행 수를 반환합니다. 코드가 중복되면 SQLException이 발생합니다. */
    int insert(Book book) throws SQLException;

    /** 코드에 해당하는 도서를 반환하고 없으면 null을 반환합니다. */
    Book detail(String code) throws SQLException;

    /** 코드에 해당하는 도서를 삭제하고 삭제된 행 수를 반환합니다. */
    int delete(String code) throws SQLException;
}
