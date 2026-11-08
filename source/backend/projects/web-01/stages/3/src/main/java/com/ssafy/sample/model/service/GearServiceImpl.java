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
    // GearService의 네 메서드를 직접 구현하세요. 요구사항 R-LAYER를 참고합니다.
    // study-target:svc-methods:end
}
