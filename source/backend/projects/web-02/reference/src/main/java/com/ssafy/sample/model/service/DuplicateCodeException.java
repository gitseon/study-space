package com.ssafy.sample.model.service;

/** 제공 코드입니다. 수정하지 않습니다. 사용자가 고칠 수 있는 중복 코드 상황을 나타냅니다. */
public class DuplicateCodeException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DuplicateCodeException(String code, Throwable cause) {
        super("이미 등록된 코드입니다: " + code, cause);
    }
}
