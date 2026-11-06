package com.ssafy.sample.model.dto;

/** 제공 코드입니다. 수정하지 않습니다. 비밀번호는 보관하지 않습니다. */
public class Member {
    private int mno;
    private String name;
    private String email;
    private String role;

    public Member() {
    }

    public int getMno() {
        return mno;
    }

    public void setMno(int mno) {
        this.mno = mno;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "Member [mno=" + mno + ", name=" + name + ", email=" + email + ", role=" + role + "]";
    }
}
