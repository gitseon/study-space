package com.ssafy.sample.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * 제공 코드입니다. 수정하지 않습니다.
 * 수업 기본 계정(ssafy/ssafy)과 로컬 MySQL 포트를 기준으로 연결합니다.
 */
public class DBUtil {
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://127.0.0.1:3306/ssafy_gear?serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String USER = "ssafy";
    private static final String PASSWORD = "ssafy";

    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static void close(AutoCloseable... closeables) {
        for (AutoCloseable c : closeables) {
            if (c != null) {
                try {
                    c.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
