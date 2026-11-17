package com.study.room.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.study.room.model.ReservationForm;
import com.study.room.service.ReservationService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // study-target:ctrl-list:start
    // TODO: GET /reservations 요청을 처리하는 목록 메서드를 작성한다. 검색 조건 roomId와 keyword는 없어도 된다
    // study-target:ctrl-list:end

    @GetMapping("/new")
    public String form(Model model) {
        model.addAttribute("form", new ReservationForm());
        model.addAttribute("rooms", service.rooms());
        return "reservation/form";
    }

    // study-target:ctrl-detail:start
    // TODO: GET /reservations/{reservationId} 요청을 처리하는 상세 메서드를 작성한다
    // study-target:ctrl-detail:end

    // study-target:ctrl-create:start
    // TODO: POST /reservations 요청을 처리하는 등록 메서드를 작성한다. 검증 오류는 입력 화면으로 돌아가고 성공하면 redirect한다
    // study-target:ctrl-create:end

    // study-target:ctrl-cancel:start
    // TODO: POST /reservations/{reservationId}/delete 요청을 처리하는 취소 메서드를 작성한다
    // study-target:ctrl-cancel:end
}
