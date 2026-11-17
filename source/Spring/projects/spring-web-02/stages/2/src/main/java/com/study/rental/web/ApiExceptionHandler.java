package com.study.rental.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.study.rental.exception.NotFoundException;
import com.study.rental.exception.RentalConflictException;
import com.study.rental.model.ErrorResponse;

@RestControllerAdvice
public class ApiExceptionHandler {
    // study-target:exc-notfound:start
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(NotFoundException e) {
        // TODO: 404 상태와 code가 NOT_FOUND인 ErrorResponse를 본문으로 응답한다
        return null;
    }
    // study-target:exc-notfound:end

    @ExceptionHandler(RentalConflictException.class)
    public ResponseEntity<ErrorResponse> conflict(RentalConflictException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("CONFLICT", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> invalid(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream().map(error -> error.getDefaultMessage()).findFirst().orElse("잘못된 요청입니다");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("VALIDATION_FAILED", message));
    }
}
