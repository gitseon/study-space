package com.study.rental.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.study.rental.mapper.MemberMapper;
import com.study.rental.model.Member;

@Service
public class DbUserDetailsService implements UserDetailsService {
    private final MemberMapper mapper;

    public DbUserDetailsService(MemberMapper mapper) {
        this.mapper = mapper;
    }

    // study-target:sec-users:start
    // TODO: 로그인 아이디로 사용자를 조회해 UserDetails를 돌려주는 loadUserByUsername을 작성한다
    // study-target:sec-users:end
}
