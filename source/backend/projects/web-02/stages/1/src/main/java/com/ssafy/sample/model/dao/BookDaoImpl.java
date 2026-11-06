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
    public List<Book> selectAll() throws SQLException {
        List<Book> list = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, author, category from book order by code";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.____()) {
                Book book = new Book();
                book.setCode(rs.getString("code"));
                book.setName(rs.getString("name"));
                book.setPrice(rs.____("price"));
                book.setAuthor(rs.getString("author"));
                book.setCategory(rs.getString("category"));
                list.____(book);
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return list;
    }
    // study-target:dao-select-all:end

    // study-target:dao-insert:start
    @Override
    public int insert(Book book) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "insert into book (code, name, price, author, category) values (?, ?, ?, ?, ?)";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, book.getCode());
            pstmt.setString(2, book.getName());
            pstmt.____(3, book.getPrice());
            pstmt.setString(____, book.getAuthor());
            pstmt.setString(5, book.getCategory());
            return pstmt.____();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    // study-target:dao-insert:end

    // study-target:dao-detail:start
    @Override
    public Book detail(String code) throws SQLException {
        Book book = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "select code, name, price, author, category from book where ____ = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            rs = pstmt.executeQuery();
            if (rs.____()) {
                book = new Book();
                book.setCode(rs.getString("code"));
                book.setName(rs.getString("name"));
                book.setPrice(rs.getInt("price"));
                book.setAuthor(rs.getString("author"));
                book.setCategory(rs.getString("category"));
            }
        } finally {
            DBUtil.close(rs, pstmt, conn);
        }
        return ____;
    }
    // study-target:dao-detail:end

    // study-target:dao-delete:start
    @Override
    public int delete(String code) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        String sql = "delete from book where ____ = ?";
        try {
            conn = DBUtil.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, code);
            return pstmt.____();
        } finally {
            DBUtil.close(pstmt, conn);
        }
    }
    // study-target:dao-delete:end
}
