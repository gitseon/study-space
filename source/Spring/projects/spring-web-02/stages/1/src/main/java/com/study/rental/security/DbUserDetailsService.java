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
        Member member = mapper.findByLoginId(loginId);
        if (member == null) {
            throw new ____(loginId);
        }
        return User.withUsername(member.getLoginId()).password(member.getPasswordHash()).____(member.getRole()).build();
    }
    // study-target:sec-users:end
}
