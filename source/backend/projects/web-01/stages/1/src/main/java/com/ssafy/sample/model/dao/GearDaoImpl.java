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
    // study-target:dao-login:end

    // study-target:dao-select-all:start
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
    // study-target:dao-select-all:end

    // study-target:dao-insert:start
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
    // study-target:dao-insert:end

    // study-target:dao-detail:start
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
    // study-target:dao-detail:end
}
