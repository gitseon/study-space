package com.study.room.web;

import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.study.room.exception.ReservationNotFoundException;
import com.study.room.exception.RoomFullException;

@ControllerAdvice
public class GlobalExceptionHandler {
    // study-target:exc-notfound:start
    // TODO: ReservationNotFoundException을 404 상태와 error/not-found 화면으로 처리하는 핸들러를 작성한다
    // study-target:exc-notfound:end

    @ExceptionHandler(RoomFullException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String full(RoomFullException e, Model model) {
        model.addAttribute("message", e.getMessage());
        return "error/full";
    }
}
