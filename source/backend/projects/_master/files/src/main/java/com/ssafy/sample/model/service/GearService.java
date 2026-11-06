package com.ssafy.sample.model.service;

import java.util.List;

import com.ssafy.sample.model.dto.Gear;
import com.ssafy.sample.model.dto.Member;

/** 제공 코드입니다. 수정하지 않습니다. */
public interface GearService {
    Member login(String email, String password);

    List<Gear> selectAll();

    /** 코드가 이미 있으면 DuplicateCodeException을 던집니다. */
    int insert(Gear gear);

    Gear detail(String code);

    /** 삭제된 행 수를 반환합니다. 없는 코드는 0입니다. */
    int delete(String code);
}
