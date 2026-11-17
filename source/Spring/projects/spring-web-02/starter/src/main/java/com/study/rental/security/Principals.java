package com.study.rental.security;

import org.springframework.security.core.userdetails.UserDetails;

public final class Principals {
    private Principals() {
    }

    public static boolean isAdmin(UserDetails user) {
        return user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
