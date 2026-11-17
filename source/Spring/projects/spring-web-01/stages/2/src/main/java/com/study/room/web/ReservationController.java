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
    @GetMapping
    public String list(@RequestParam(required = false) Integer roomId,
            @RequestParam(required = false) String keyword, Model model) {
        // TODO: 서비스로 목록을 조회해 모델에 담고 뷰 이름을 반환한다
        return null;
    }
    // study-target:ctrl-list:end

    @GetMapping("/new")
    public String form(Model model) {
        model.addAttribute("form", new ReservationForm());
        model.addAttribute("rooms", service.rooms());
        return "reservation/form";
    }

    // study-target:ctrl-detail:start
    @GetMapping("/{reservationId}")
    public String detail(@PathVariable int reservationId, Model model) {
        // TODO: 서비스로 예약 한 건을 조회해 모델에 담고 뷰 이름을 반환한다
        return null;
    }
    // study-target:ctrl-detail:end

    // study-target:ctrl-create:start
    @PostMapping
    public String create(@Valid @ModelAttribute("form") ReservationForm form, BindingResult result,
            Model model, RedirectAttributes attrs) {
        // TODO: 검증 오류가 있으면 방 목록을 다시 담아 입력 화면으로 돌아간다
        // TODO: 예약을 저장하고 flash 메시지를 담은 뒤 상세 화면으로 redirect한다
        return null;
    }
    // study-target:ctrl-create:end

    // study-target:ctrl-cancel:start
    @PostMapping("/{reservationId}/delete")
    public String cancel(@PathVariable int reservationId, RedirectAttributes attrs) {
        // TODO: 예약을 취소하고 flash 메시지를 담은 뒤 목록으로 redirect한다
        return null;
    }
    // study-target:ctrl-cancel:end
}
