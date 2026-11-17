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

    // @@target ctrl-rent
    @PostMapping("/rentals")
    public ResponseEntity<RentalResponse> rent(@Valid @RequestBody RentalRequest request, @AuthenticationPrincipal UserDetails user) {
        int rentalId = service.rent(user.getUsername(), request);
        RentalResponse body = RentalResponse.from(service.get(rentalId, user.getUsername(), Principals.isAdmin(user)));
        return ResponseEntity.created(URI.create("/api/rentals/" + rentalId)).body(body);
    }
    // @@stage 1
    @PostMapping("/rentals")
    public ResponseEntity<RentalResponse> rent(@____ @RequestBody RentalRequest request, @AuthenticationPrincipal UserDetails user) {
        int rentalId = service.rent(user.getUsername(), request);
        RentalResponse body = RentalResponse.from(service.get(rentalId, user.getUsername(), Principals.isAdmin(user)));
        return ResponseEntity.____(URI.create("/api/rentals/" + rentalId)).body(body);
    }
    // @@stage 2
    @PostMapping("/rentals")
    public ResponseEntity<RentalResponse> rent(@Valid @RequestBody RentalRequest request, @AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자의 아이디로 대여하고 만들어진 대여를 응답 본문에 담는다
        // TODO: 상태는 201이고 Location 헤더에 /api/rentals/{번호}를 담는다
        return null;
    }
    // @@stage 3
    // TODO: POST /api/rentals 요청을 처리하는 rent 메서드를 작성한다. 요청 본문은 검증하고 성공하면 201과 Location을 응답한다
    // @@end

    // @@target ctrl-get
    @GetMapping("/rentals/{rentalId}")
    public RentalResponse get(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        return RentalResponse.from(service.get(rentalId, user.getUsername(), Principals.isAdmin(user)));
    }
    // @@stage 1
    @GetMapping("/rentals/{rentalId}")
    public RentalResponse get(@____ int rentalId, @____ UserDetails user) {
        return RentalResponse.from(service.get(rentalId, user.____(), Principals.isAdmin(user)));
    }
    // @@stage 2
    @GetMapping("/rentals/{rentalId}")
    public RentalResponse get(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자와 관리자 여부를 서비스에 넘겨 대여 한 건을 돌려준다
        return null;
    }
    // @@stage 3
    // TODO: GET /api/rentals/{rentalId} 요청을 처리하는 get 메서드를 작성한다
    // @@end

    // @@target ctrl-cancel
    @DeleteMapping("/rentals/{rentalId}")
    public ResponseEntity<Void> cancel(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        service.cancel(rentalId, user.getUsername(), Principals.isAdmin(user));
        return ResponseEntity.noContent().build();
    }
    // @@stage 1
    @DeleteMapping("/rentals/{rentalId}")
    public ResponseEntity<Void> cancel(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        service.____(rentalId, user.getUsername(), Principals.isAdmin(user));
        return ResponseEntity.____().build();
    }
    // @@stage 2
    @DeleteMapping("/rentals/{rentalId}")
    public ResponseEntity<Void> cancel(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        // TODO: 대여를 취소하고 본문 없는 204로 응답한다
        return null;
    }
    // @@stage 3
    // TODO: DELETE /api/rentals/{rentalId} 요청을 처리하는 cancel 메서드를 작성한다
    // @@end

    // @@target ctrl-mine
    @GetMapping("/rentals")
    public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
        return service.mine(user.getUsername()).stream().map(RentalResponse::from).toList();
    }
    // @@stage 1
    @GetMapping("/rentals")
    public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
        return service.____(user.getUsername()).stream().map(RentalResponse::____).toList();
    }
    // @@stage 2
    @GetMapping("/rentals")
    public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
        // TODO: 로그인한 사용자의 대여 목록을 응답 객체 목록으로 바꿔 돌려준다
        return List.of();
    }
    // @@stage 3
    // TODO: GET /api/rentals 요청을 처리하는 mine 메서드를 작성한다. 로그인한 사용자의 대여만 돌려준다
    // @@end

    // @@target ctrl-admin
    @GetMapping("/admin/rentals")
    public List<RentalResponse> all() {
        return service.all().stream().map(RentalResponse::from).toList();
    }
    // @@stage 1
    @GetMapping("/admin/rentals")
    public List<RentalResponse> all() {
        return service.____().stream().map(RentalResponse::____).toList();
    }
    // @@stage 2
    @GetMapping("/admin/rentals")
    public List<RentalResponse> all() {
        // TODO: 모든 대여를 응답 객체 목록으로 바꿔 돌려준다. 접근 제한은 보안 설정이 맡는다
        return List.of();
    }
    // @@stage 3
    // TODO: GET /api/admin/rentals 요청을 처리하는 all 메서드를 작성한다
    // @@end
}
