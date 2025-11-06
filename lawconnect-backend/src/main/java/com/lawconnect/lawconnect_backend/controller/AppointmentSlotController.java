package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.models.AppointmentSlot;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.services.AppointmentSlotService;
import com.lawconnect.lawconnect_backend.services.LawyerService;
import com.lawconnect.lawconnect_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/slots")
public class AppointmentSlotController {

    @Autowired
    private AppointmentSlotService appointmentSlotService;
    @Autowired
    private UserService userService;
    @Autowired
    private LawyerService lawyerService;


    @GetMapping("/lawyerSlots")
    public ResponseEntity<List<AppointmentSlot>> getAllAppointmentsByLawyerId(Authentication authentication){
        User user = userService.getUserByEmail(authentication.getName());
        Lawyer  lawyer = lawyerService.getLawyerByUser(user.getId());
        return ResponseEntity.ok(appointmentSlotService.getAllAppointmentOfLawyer(lawyer.getId()));
    }
    @PostMapping("/create")
    public ResponseEntity<?> createSlot(@RequestBody AppointmentSlot slot, Authentication authentication){
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(appointmentSlotService.createSlot(slot,user));
    }
}

