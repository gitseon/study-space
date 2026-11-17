package com.study.rental.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.study.rental.model.Member;

@Mapper
public interface MemberMapper {
    Member findByLoginId(String loginId);
}
