package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.DTO.RatingDTO;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.services.LawyerService;
import com.lawconnect.lawconnect_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RatingController {
    @Autowired
    private LawyerService lawyerService;
    @Autowired
    private UserService userService;

    @PostMapping("/rate-lawyer")
    public ResponseEntity<?> rateLawyer(@RequestBody RatingDTO request,
                                        Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        try {
            lawyerService.rateLawyer(request.getAppointmentId(),request.getLawyerId(), request.getRating());
            return ResponseEntity.ok("Rating submitted successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit rating");
        }
    }
}
