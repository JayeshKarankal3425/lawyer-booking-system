package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.DTO.BookingDTO;
import com.lawconnect.lawconnect_backend.models.Appointment;
import com.lawconnect.lawconnect_backend.models.AppointmentSlot;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.services.AppointmentService;
import com.lawconnect.lawconnect_backend.services.AppointmentSlotService;
import com.lawconnect.lawconnect_backend.services.LawyerService;
import com.lawconnect.lawconnect_backend.services.UserService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://127.0.0." +
        ":5500")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private LawyerService lawyerService;

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private AppointmentSlotService appointmentSlotService;

    @GetMapping("/getAll")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/getAllLawyers")
    public List<Lawyer> getAllLawyers(){
        return lawyerService.getAllLawyers();
    }
    @GetMapping("/get")
    public User getUser(Authentication authentication){
        return userService.getUserByEmail(authentication.getName());
    }
    // User Registration
    @PostMapping("/add")
    public void addUser(@RequestBody User user){
        userService.addUser(user);
    }
    @PutMapping("/updateProfile")
    public void updateProfile(Authentication authentication, @RequestBody User user){
        userService.updateUser(authentication.getName(),user);
    }

    @GetMapping("/userAppointments")
    public List<Appointment> getAllAppointmentsOfUser(Authentication authentication){
        User user  = userService.getUserByEmail(authentication.getName());
        return appointmentService.getAllAppointmentsUser(user.getId());
    }
    @PutMapping("/updatePassword/{id}")
    public void updatePassword(@PathVariable long id,@RequestBody User user){
        userService.updatePassword(id,user);
    }

    @GetMapping("lawyer/{lawyerId}/slots")
    public List<AppointmentSlot> getAvailableSlots(@PathVariable("lawyerId") long id){
        return appointmentSlotService.getAvailableAppointmentSlots(id);
    }
    @GetMapping("lawyerProfile/{lawyerId}")
    public Lawyer getLawyer(@PathVariable("lawyerId") long id){
        return lawyerService.getLawyer(id);
    }
    @PostMapping("/book")
    public ResponseEntity<Map<String, String>> bookAppointment(@RequestBody BookingDTO booking, Authentication authentication) {
        boolean success = appointmentService.bookAppointment(booking.getSlotId(),authentication.getName());
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message","Appointment booked successfully.");
        }
        return ResponseEntity.ok(response);
    }
}
