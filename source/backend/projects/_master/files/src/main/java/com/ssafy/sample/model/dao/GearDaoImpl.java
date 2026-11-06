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

    //@@target dao-login
    @Override
    public Member login(String email, String password) throws SQLException {
        Member member = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select mno, name, email, role from member where email = ? and password = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, password);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                member = new Member();
                member.setMno(rs.getInt("mno"));
                member.setName(rs.getString("name"));
                member.setEmail(rs.getString("email"));
                member.setRole(rs.getString("role"));
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return member;
    }
    //@@stage 1
    @Override
    public Member login(String email, String password) throws SQLException {
        Member member = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select mno, name, email, role from member where email = ? and ____ = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(____, password);
            rs = pstmt.executeQuery();
            if (rs.____()) {
                member = new Member();
                member.setMno(rs.getInt("mno"));
                member.setName(rs.getString("name"));
                member.setEmail(rs.getString("email"));
                member.setRole(rs.getString("role"));
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return member;
    }
    //@@stage 2
    @Override
    public Member login(String email, String password) throws SQLException {
        // TODO: member 테이블에서 이메일과 비밀번호가 모두 일치하는 회원을 조회하세요.
        // 일치하는 행이 있으면 mno, name, email, role을 Member에 담아 반환하고 없으면 null을 반환합니다.
        // 비밀번호는 Member에 담지 않습니다. 자원은 finally에서 DBUtil.close로 닫습니다.
        return null;
    }
    //@@stage 3
    // login 메서드를 직접 작성하세요. 요구사항 R-LOGIN을 참고합니다.
    //@@end

    //@@target dao-select-all
    @Override
    public List<Gear> selectAll() throws SQLException {
        List<Gear> list = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, brand, color from gear order by code";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                Gear gear = new Gear();
                gear.setCode(rs.getString("code"));
                gear.setName(rs.getString("name"));
                gear.setPrice(rs.getInt("price"));
                gear.setBrand(rs.getString("brand"));
                gear.setColor(rs.getString("color"));
                list.add(gear);
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return list;
    }
    //@@stage 1
    @Override
    public List<Gear> selectAll() throws SQLException {
        List<Gear> list = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, brand, color from gear order by code";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.____()) {
                Gear gear = new Gear();
                gear.setCode(rs.getString("code"));
                gear.setName(rs.getString("name"));
                gear.setPrice(rs.____("price"));
                gear.setBrand(rs.getString("brand"));
                gear.setColor(rs.getString("color"));
                list.____(gear);
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return list;
    }
    //@@stage 2
    @Override
    public List<Gear> selectAll() throws SQLException {
        // TODO: gear 테이블의 모든 행을 code 순서로 조회해 Gear 목록으로 반환하세요.
        // 결과가 없으면 null이 아닌 빈 목록을 반환합니다.
        return new ArrayList<>();
    }
    //@@stage 3
    // selectAll 메서드를 직접 작성하세요. 요구사항 R-LIST를 참고합니다.
    //@@end

    //@@target dao-insert
    @Override
    public int insert(Gear gear) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "insert into gear (code, name, price, brand, color) values (?, ?, ?, ?, ?)";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, gear.getCode());
            pstmt.setString(2, gear.getName());
            pstmt.setInt(3, gear.getPrice());
            pstmt.setString(4, gear.getBrand());
            pstmt.setString(5, gear.getColor());
            return pstmt.executeUpdate();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    //@@stage 1
    @Override
    public int insert(Gear gear) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "insert into gear (code, name, price, brand, color) values (?, ?, ?, ?, ?)";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, gear.getCode());
            pstmt.setString(2, gear.getName());
            pstmt.____(3, gear.getPrice());
            pstmt.setString(____, gear.getBrand());
            pstmt.setString(5, gear.getColor());
            return pstmt.____();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    //@@stage 2
    @Override
    public int insert(Gear gear) throws SQLException {
        // TODO: gear 테이블에 한 행을 추가하세요. 값은 PreparedStatement로 바인딩합니다.
        // 영향받은 행 수를 반환하고 자원은 finally에서 닫습니다.
        return 0;
    }
    //@@stage 3
    // insert 메서드를 직접 작성하세요. 요구사항 R-REGIST를 참고합니다.
    //@@end

    //@@target dao-detail
    @Override
    public Gear detail(String code) throws SQLException {
        Gear gear = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, brand, color from gear where code = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                gear = new Gear();
                gear.setCode(rs.getString("code"));
                gear.setName(rs.getString("name"));
                gear.setPrice(rs.getInt("price"));
                gear.setBrand(rs.getString("brand"));
                gear.setColor(rs.getString("color"));
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return gear;
    }
    //@@stage 1
    @Override
    public Gear detail(String code) throws SQLException {
        Gear gear = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, brand, color from gear where ____ = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            rs = pstmt.executeQuery();
            if (rs.____()) {
                gear = new Gear();
                gear.setCode(rs.getString("code"));
                gear.setName(rs.getString("name"));
                gear.setPrice(rs.getInt("price"));
                gear.setBrand(rs.getString("brand"));
                gear.setColor(rs.getString("color"));
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return ____;
    }
    //@@stage 2
    @Override
    public Gear detail(String code) throws SQLException {
        // TODO: code가 일치하는 용품 한 건을 조회해 Gear로 반환하세요.
        // 행이 없으면 null을 반환합니다.
        return null;
    }
    //@@stage 3
    // detail 메서드를 직접 작성하세요. 요구사항 R-DETAIL을 참고합니다.
    //@@end

    //@@target dao-delete
    @Override
    public int delete(String code) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "delete from gear where code = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            return pstmt.executeUpdate();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    //@@stage 1
    @Override
    public int delete(String code) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "delete from gear where ____ = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            return pstmt.____();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    //@@stage 2
    @Override
    public int delete(String code) throws SQLException {
        // TODO: code가 일치하는 용품을 삭제하고 삭제된 행 수를 반환하세요.
        return 0;
    }
    //@@stage 3
    // delete 메서드를 직접 작성하세요. 요구사항 R-DELETE를 참고합니다.
    //@@end
}
