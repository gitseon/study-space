package com.ssafy.sample.model.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.ssafy.sample.model.dto.Book;
import com.ssafy.sample.model.dto.Member;
import com.ssafy.sample.util.DBUtil;

public class BookDaoImpl implements BookDao {

    private BookDaoImpl() {
    }

    private static final BookDao instance = new BookDaoImpl();

    public static BookDao getInstance() {
        return instance;
    }

    // study-target:dao-login:start
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    // study-target:dao-login:end

    // study-target:dao-select-all:start
    // selectAll 메서드를 직접 작성하세요. 요구사항 R-LIST를 참고합니다.
    // study-target:dao-select-all:end

    // study-target:dao-insert:start
    // insert 메서드를 직접 작성하세요. 요구사항 R-REGIST를 참고합니다.
    // study-target:dao-insert:end

    // study-target:dao-detail:start
    // detail 메서드를 직접 작성하세요. 요구사항 R-DETAIL을 참고합니다.
    // study-target:dao-detail:end
}
