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
    @Override
    public UserDetails loadUserByUsername(String loginId) {
        // TODO: 사용자를 조회해 없으면 UsernameNotFoundException을 던지고 있으면 이름, 해시 비밀번호, 역할로 UserDetails를 만든다
        return null;
    }
    // study-target:sec-users:end
}
