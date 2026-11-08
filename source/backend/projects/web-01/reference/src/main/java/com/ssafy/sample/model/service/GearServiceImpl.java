package com.ssafy.sample.model.service;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

import com.ssafy.sample.model.dao.GearDao;
import com.ssafy.sample.model.dao.GearDaoImpl;
import com.ssafy.sample.model.dto.Gear;
import com.ssafy.sample.model.dto.Member;

public class GearServiceImpl implements GearService {

    private GearServiceImpl() {
    }

    private final GearDao dao = GearDaoImpl.getInstance();
    private static final GearService instance = new GearServiceImpl();

    public static GearService getInstance() {
        return instance;
    }

    @Override
    public Member login(String email, String password) {
        try {
            return dao.login(email, password);
        } catch (SQLException e) {
            throw new IllegalStateException("로그인 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public List<Gear> selectAll() {
        try {
            return dao.selectAll();
        } catch (SQLException e) {
            throw new IllegalStateException("용품 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public int insert(Gear gear) {
        try {
            return dao.insert(gear);
        } catch (SQLIntegrityConstraintViolationException e) {
            return 0;
        } catch (SQLException e) {
            throw new IllegalStateException("용품 등록 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public Gear detail(String code) {
        try {
            return dao.detail(code);
        } catch (SQLException e) {
            throw new IllegalStateException("용품 상세 조회 중 오류가 발생했습니다.", e);
        }
    }
}
