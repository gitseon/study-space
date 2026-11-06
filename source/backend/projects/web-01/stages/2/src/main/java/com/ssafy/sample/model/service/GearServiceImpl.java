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

    // study-target:svc-methods:start
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
        // 중복 키(SQLIntegrityConstraintViolationException)는 DuplicateCodeException으로 바꿉니다.
        // 그 밖의 SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return 0;
    }

    @Override
    public Gear detail(String code) {
        // TODO: dao.detail을 호출하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return null;
    }

    @Override
    public int delete(String code) {
        // TODO: dao.delete를 호출해 삭제된 행 수를 반환하세요. SQLException은 원인을 보존해 IllegalStateException으로 바꿔 던집니다.
        return 0;
    }
    // study-target:svc-methods:end
}
