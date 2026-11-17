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
    // @@target exc-notfound
    @ExceptionHandler(ReservationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String notFound(ReservationNotFoundException e, Model model) {
        model.addAttribute("message", e.getMessage());
        return "error/not-found";
    }
    // @@stage 1
    @ExceptionHandler(____.class)
    @ResponseStatus(HttpStatus.____)
    public String notFound(ReservationNotFoundException e, Model model) {
        model.addAttribute("message", e.getMessage());
        return "error/not-found";
    }
    // @@stage 2
    @ExceptionHandler(ReservationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String notFound(ReservationNotFoundException e, Model model) {
        // TODO: 메시지를 모델에 담고 not-found 화면 이름을 반환한다
        return null;
    }
    // @@stage 3
    // TODO: ReservationNotFoundException을 404 상태와 error/not-found 화면으로 처리하는 핸들러를 작성한다
    // @@end

    @ExceptionHandler(RoomFullException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String full(RoomFullException e, Model model) {
        model.addAttribute("message", e.getMessage());
        return "error/full";
    }
}
