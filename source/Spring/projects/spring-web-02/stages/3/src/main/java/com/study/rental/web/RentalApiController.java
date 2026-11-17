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
    // TODO: POST /api/rentals 요청을 처리하는 rent 메서드를 작성한다. 요청 본문은 검증하고 성공하면 201과 Location을 응답한다
    // study-target:ctrl-rent:end

    // study-target:ctrl-get:start
    // TODO: GET /api/rentals/{rentalId} 요청을 처리하는 get 메서드를 작성한다
    // study-target:ctrl-get:end

    // study-target:ctrl-cancel:start
    // TODO: DELETE /api/rentals/{rentalId} 요청을 처리하는 cancel 메서드를 작성한다
    // study-target:ctrl-cancel:end

    // study-target:ctrl-mine:start
    // TODO: GET /api/rentals 요청을 처리하는 mine 메서드를 작성한다. 로그인한 사용자의 대여만 돌려준다
    // study-target:ctrl-mine:end

    // study-target:ctrl-admin:start
    // TODO: GET /api/admin/rentals 요청을 처리하는 all 메서드를 작성한다
    // study-target:ctrl-admin:end
}
