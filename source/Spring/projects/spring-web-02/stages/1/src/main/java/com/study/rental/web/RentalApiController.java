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
    public ResponseEntity<RentalResponse> rent(@____ @RequestBody RentalRequest request, @AuthenticationPrincipal UserDetails user) {
        int rentalId = service.rent(user.getUsername(), request);
        RentalResponse body = RentalResponse.from(service.get(rentalId, user.getUsername(), Principals.isAdmin(user)));
        return ResponseEntity.____(URI.create("/api/rentals/" + rentalId)).body(body);
    }
    // study-target:ctrl-rent:end

    // study-target:ctrl-get:start
    @GetMapping("/rentals/{rentalId}")
    public RentalResponse get(@____ int rentalId, @____ UserDetails user) {
        return RentalResponse.from(service.get(rentalId, user.____(), Principals.isAdmin(user)));
    }
    // study-target:ctrl-get:end

    // study-target:ctrl-cancel:start
    @DeleteMapping("/rentals/{rentalId}")
    public ResponseEntity<Void> cancel(@PathVariable int rentalId, @AuthenticationPrincipal UserDetails user) {
        service.____(rentalId, user.getUsername(), Principals.isAdmin(user));
        return ResponseEntity.____().build();
    }
    // study-target:ctrl-cancel:end

    // study-target:ctrl-mine:start
    @GetMapping("/rentals")
    public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
        return service.____(user.getUsername()).stream().map(RentalResponse::____).toList();
    }
    // study-target:ctrl-mine:end

    // study-target:ctrl-admin:start
    @GetMapping("/admin/rentals")
    public List<RentalResponse> all() {
        return service.____().stream().map(RentalResponse::____).toList();
    }
    // study-target:ctrl-admin:end
}
