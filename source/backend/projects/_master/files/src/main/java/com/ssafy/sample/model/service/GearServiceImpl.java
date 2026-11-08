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

    //@@target svc-methods
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
    //@@stage 1
    @Override
    public Member login(String email, String password) {
        try {
            return dao.____(email, password);
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
        } catch (____ e) {
            return 0;
        } catch (SQLException e) {
            throw new IllegalStateException("용품 등록 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public Gear detail(String code) {
        try {
            return dao.____(code);
        } catch (SQLException e) {
            throw new IllegalStateException("용품 상세 조회 중 오류가 발생했습니다.", e);
        }
    }
    //@@stage 2
    @Override
    public Member login(String email, String password) {
        // TODO: dao.login을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return null;
    }

    @Override
    public List<Gear> selectAll() {
        // TODO: dao.selectAll을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return List.of();
    }

    @Override
    public int insert(Gear gear) {
        // TODO: dao.insert를 호출하세요.
        // 중복 키(SQLIntegrityConstraintViolationException)는 저장하지 못한 것이므로 0을 반환합니다.
        // 그 밖의 SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return 0;
    }

    @Override
    public Gear detail(String code) {
        // TODO: dao.detail을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return null;
    }
    //@@stage 3
    // GearService의 네 메서드를 직접 구현하세요. 요구사항 R-LAYER를 참고합니다.
    //@@end
}
