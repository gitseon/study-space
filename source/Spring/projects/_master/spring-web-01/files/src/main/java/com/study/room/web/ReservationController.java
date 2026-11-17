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

    // @@target ctrl-list
    @GetMapping
    public String list(@RequestParam(required = false) Integer roomId,
            @RequestParam(required = false) String keyword, Model model) {
        model.addAttribute("reservations", service.search(roomId, keyword));
        model.addAttribute("rooms", service.rooms());
        model.addAttribute("roomId", roomId);
        model.addAttribute("keyword", keyword);
        return "reservation/list";
    }
    // @@stage 1
    @GetMapping
    public String list(@RequestParam(required = false) Integer roomId,
            @RequestParam(required = false) String keyword, Model model) {
        model.addAttribute("reservations", service.____(roomId, keyword));
        model.addAttribute("rooms", service.rooms());
        model.addAttribute("roomId", roomId);
        model.addAttribute("keyword", keyword);
        return "____";
    }
    // @@stage 2
    @GetMapping
    public String list(@RequestParam(required = false) Integer roomId,
            @RequestParam(required = false) String keyword, Model model) {
        // TODO: 서비스로 목록을 조회해 모델에 담고 뷰 이름을 반환한다
        return null;
    }
    // @@stage 3
    // TODO: GET /reservations 요청을 처리하는 목록 메서드를 작성한다. 검색 조건 roomId와 keyword는 없어도 된다
    // @@end

    @GetMapping("/new")
    public String form(Model model) {
        model.addAttribute("form", new ReservationForm());
        model.addAttribute("rooms", service.rooms());
        return "reservation/form";
    }

    // @@target ctrl-detail
    @GetMapping("/{reservationId}")
    public String detail(@PathVariable int reservationId, Model model) {
        model.addAttribute("reservation", service.detail(reservationId));
        return "reservation/detail";
    }
    // @@stage 1
    @GetMapping("/{reservationId}")
    public String detail(@____ int reservationId, Model model) {
        model.addAttribute("reservation", service.____(reservationId));
        return "reservation/detail";
    }
    // @@stage 2
    @GetMapping("/{reservationId}")
    public String detail(@PathVariable int reservationId, Model model) {
        // TODO: 서비스로 예약 한 건을 조회해 모델에 담고 뷰 이름을 반환한다
        return null;
    }
    // @@stage 3
    // TODO: GET /reservations/{reservationId} 요청을 처리하는 상세 메서드를 작성한다
    // @@end

    // @@target ctrl-create
    @PostMapping
    public String create(@Valid @ModelAttribute("form") ReservationForm form, BindingResult result,
            Model model, RedirectAttributes attrs) {
        if (result.hasErrors()) {
            model.addAttribute("rooms", service.rooms());
            return "reservation/form";
        }
        int reservationId = service.reserve(form);
        attrs.addFlashAttribute("message", "예약했습니다");
        return "redirect:/reservations/" + reservationId;
    }
    // @@stage 1
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
    // @@stage 2
    @PostMapping
    public String create(@Valid @ModelAttribute("form") ReservationForm form, BindingResult result,
            Model model, RedirectAttributes attrs) {
        // TODO: 검증 오류가 있으면 방 목록을 다시 담아 입력 화면으로 돌아간다
        // TODO: 예약을 저장하고 flash 메시지를 담은 뒤 상세 화면으로 redirect한다
        return null;
    }
    // @@stage 3
    // TODO: POST /reservations 요청을 처리하는 등록 메서드를 작성한다. 검증 오류는 입력 화면으로 돌아가고 성공하면 redirect한다
    // @@end

    // @@target ctrl-cancel
    @PostMapping("/{reservationId}/delete")
    public String cancel(@PathVariable int reservationId, RedirectAttributes attrs) {
        service.cancel(reservationId);
        attrs.addFlashAttribute("message", "예약을 취소했습니다");
        return "redirect:/reservations";
    }
    // @@stage 1
    @PostMapping("/{reservationId}/delete")
    public String cancel(@PathVariable int reservationId, RedirectAttributes attrs) {
        service.____(reservationId);
        attrs.____("message", "예약을 취소했습니다");
        return "redirect:/reservations";
    }
    // @@stage 2
    @PostMapping("/{reservationId}/delete")
    public String cancel(@PathVariable int reservationId, RedirectAttributes attrs) {
        // TODO: 예약을 취소하고 flash 메시지를 담은 뒤 목록으로 redirect한다
        return null;
    }
    // @@stage 3
    // TODO: POST /reservations/{reservationId}/delete 요청을 처리하는 취소 메서드를 작성한다
    // @@end
}
