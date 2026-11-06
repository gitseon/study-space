package com.ssafy.sample.model.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.ssafy.sample.model.dto.Gear;
import com.ssafy.sample.model.dto.Member;
import com.ssafy.sample.util.DBUtil;

public class GearDaoImpl implements GearDao {

    private GearDaoImpl() {
    }

    private static final GearDao instance = new GearDaoImpl();

    public static GearDao getInstance() {
        return instance;
    }

    // study-target:dao-login:start
    @Override
    public Member login(String email, String password) throws SQLException {
        // TODO: member 테이블에서 이메일과 비밀번호가 모두 일치하는 회원을 조회하세요.
        // 일치하는 행이 있으면 mno, name, email, role을 Member에 담아 반환하고 없으면 null을 반환합니다.
        // 비밀번호는 Member에 담지 않습니다. 자원은 finally에서 DBUtil.close로 닫습니다.
        return null;
    }
    // study-target:dao-login:end

    // study-target:dao-select-all:start
    @Override
    public List<Gear> selectAll() throws SQLException {
        // TODO: gear 테이블의 모든 행을 code 순서로 조회해 Gear 목록으로 반환하세요.
        // 결과가 없으면 null이 아닌 빈 목록을 반환합니다.
        return new ArrayList<>();
    }
    // study-target:dao-select-all:end

    // study-target:dao-insert:start
    @Override
    public int insert(Gear gear) throws SQLException {
        // TODO: gear 테이블에 한 행을 추가하세요. 값은 PreparedStatement로 바인딩합니다.
        // 영향받은 행 수를 반환하고 자원은 finally에서 닫습니다.
        return 0;
    }
    // study-target:dao-insert:end

    // study-target:dao-detail:start
    @Override
    public Gear detail(String code) throws SQLException {
        // TODO: code가 일치하는 용품 한 건을 조회해 Gear로 반환하세요.
        // 행이 없으면 null을 반환합니다.
        return null;
    }
    // study-target:dao-detail:end

    // study-target:dao-delete:start
    @Override
    public int delete(String code) throws SQLException {
        // TODO: code가 일치하는 용품을 삭제하고 삭제된 행 수를 반환하세요.
        return 0;
    }
    // study-target:dao-delete:end
}
