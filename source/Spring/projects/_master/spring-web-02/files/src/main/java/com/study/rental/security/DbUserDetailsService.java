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

    // @@target sec-users
    @Override
    public UserDetails loadUserByUsername(String loginId) {
        Member member = mapper.findByLoginId(loginId);
        if (member == null) {
            throw new UsernameNotFoundException(loginId);
        }
        return User.withUsername(member.getLoginId()).password(member.getPasswordHash()).roles(member.getRole()).build();
    }
    // @@stage 1
    @Override
    public UserDetails loadUserByUsername(String loginId) {
        Member member = mapper.findByLoginId(loginId);
        if (member == null) {
            throw new ____(loginId);
        }
        return User.withUsername(member.getLoginId()).password(member.getPasswordHash()).____(member.getRole()).build();
    }
    // @@stage 2
    @Override
    public UserDetails loadUserByUsername(String loginId) {
        // TODO: 사용자를 조회해 없으면 UsernameNotFoundException을 던지고 있으면 이름, 해시 비밀번호, 역할로 UserDetails를 만든다
        return null;
    }
    // @@stage 3
    // TODO: 로그인 아이디로 사용자를 조회해 UserDetails를 돌려주는 loadUserByUsername을 작성한다
    // @@end
}
