package com.study.rental.web;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.rental.model.Equipment;
import com.study.rental.model.RentalRequest;
import com.study.rental.model.RentalResponse;
import com.study.rental.security.Principals;
import com.study.rental.service.RentalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class RentalApiController {
    private final RentalService service;

    public RentalApiController(RentalService service) {
        this.service = service;
    }

    @GetMapping("/equipments")
    public List<Equipment> equipments() {
        return service.equipments();
    }

    // study-target:ctrl-rent:start
    @PostMapping("/rentals")
    public ResponseEntity<RentalResponse> rent(@Valid @RequestBody RentalRequest request, @AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자의 아이디로 대여하고 만들어진 대여를 응답 본문에 담는다
        // TODO: 상태는 201이고 Location 헤더에 /api/rentals/{번호}를 담는다
        return null;
    }
    // study-target:ctrl-rent:end

    // study-target:ctrl-get:start
    @GetMapping("/rentals/{rentalId}")
    public RentalResponse get(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자와 관리자 여부를 서비스에 넘겨 대여 한 건을 돌려준다
        return null;
    }
    // study-target:ctrl-get:end

    // study-target:ctrl-cancel:start
    @DeleteMapping("/rentals/{rentalId}")
    public ResponseEntity<Void> cancel(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        // TODO: 대여를 취소하고 본문 없는 204로 응답한다
        return null;
    }
    // study-target:ctrl-cancel:end

    // study-target:ctrl-mine:start
    @GetMapping("/rentals")
    public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자의 대여 목록을 응답 객체 목록으로 바꿔 돌려준다
        return List.of();
    }
    // study-target:ctrl-mine:end

    // study-target:ctrl-admin:start
    @GetMapping("/admin/rentals")
    public List<RentalResponse> all() {
        // TODO: 모든 대여를 응답 객체 목록으로 바꿔 돌려준다. 접근 제한은 보안 설정이 맡는다
        return List.of();
    }
    // study-target:ctrl-admin:end
}
