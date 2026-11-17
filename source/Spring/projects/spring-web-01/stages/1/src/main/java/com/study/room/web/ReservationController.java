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
        model.addAttribute("reservations", service.____(roomId, keyword));
        model.addAttribute("rooms", service.rooms());
        model.addAttribute("roomId", roomId);
        model.addAttribute("keyword", keyword);
        return "____";
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
    public String detail(@____ int reservationId, Model model) {
        model.addAttribute("reservation", service.____(reservationId));
        return "reservation/detail";
    }
    // study-target:ctrl-detail:end

    // study-target:ctrl-create:start
    @PostMapping
    public String create(@____ @ModelAttribute("form") ReservationForm form, ____ result,
            Model model, RedirectAttributes attrs) {
        if (result.____()) {
            model.addAttribute("rooms", service.rooms());
            return "reservation/form";
        }
        int reservationId = service.reserve(form);
        attrs.addFlashAttribute("message", "예약했습니다");
        return "____:/reservations/" + reservationId;
    }
    // study-target:ctrl-create:end

    // study-target:ctrl-cancel:start
    @PostMapping("/{reservationId}/delete")
    public String cancel(@PathVariable int reservationId, RedirectAttributes attrs) {
        service.____(reservationId);
        attrs.____("message", "예약을 취소했습니다");
        return "redirect:/reservations";
    }
    // study-target:ctrl-cancel:end
}
