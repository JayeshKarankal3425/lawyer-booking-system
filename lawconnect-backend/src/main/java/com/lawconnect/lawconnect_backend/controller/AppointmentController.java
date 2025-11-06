package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.DTO.AppointmentStatus;
import com.lawconnect.lawconnect_backend.DTO.BookingDTO;
import com.lawconnect.lawconnect_backend.models.Appointment;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.services.AppointmentService;
import com.lawconnect.lawconnect_backend.services.LawyerService;
import com.lawconnect.lawconnect_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    UserService userService;
    @Autowired
    LawyerService lawyerService;
//    @PostMapping("/book")
//    public String bookAppointment(@RequestBody BookingDTO booking) {
//        boolean success = appointmentService.bookAppointment(booking.getSlotId(),booking.getUserId());
//        if (success) {
//            return "Appointment booked successfully.";
//        }
//        return "Slot is not available or already booked.";
//    }

    @PutMapping("/update-status/{appointmentId}")
    public String updateAppointmentStatus(
            @PathVariable long appointmentId,
            @RequestBody AppointmentStatus request
    ) {
        Appointment appointment = appointmentService.getAppointment(appointmentId);

        // Generate unique room name for Jitsi
        String roomName = "appointment-" + appointment.getClient().getId()
                + "-" + appointment.getLawyer().getId()
                + "-" + UUID.randomUUID().toString().substring(0, 5);

        // Public Jitsi meet link (no login required)
        String meetLink = "https://meet.jit.si/" + roomName
                + "#config.startWithVideoMuted=true"
                + "&config.prejoinPageEnabled=false"; // skip prejoin lobby

        // (Optional) You can’t enforce start/end time on public Jitsi links
        // Instead, handle meeting duration from your backend logic

        appointment.setMeetLink(meetLink);
        appointment.setStatus(request.getStatus());
        appointmentService.updateStatus(appointment);

        return "Appointment status updated to " + request.getStatus() +
                ". Meet link: " + meetLink;
    }

    @GetMapping("/get/byStatus")
    public List<Appointment> getAppointments (@RequestBody AppointmentStatus status){
        List<Appointment> appointments = appointmentService.getAppointments(status.getStatus());
        return appointments;
    }
    @GetMapping("/lawyer/allAppointments")
    public List<Appointment> getAllAppointments(Authentication authentication){
        User user = userService.getUserByEmail(authentication.getName());
        Lawyer lawyer = lawyerService.getLawyerByUser(user.getId());
        return appointmentService.getAllAppointments(lawyer.getId());
    }
    @GetMapping("/client/upcoming")
    public List<Appointment> getUpcomingAppointmentsForClient(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return appointmentService.getUpcomingAppointmentsForClient(user.getId());
    }

    @GetMapping("/lawyer/{lawyerId}/upcoming")
    public List<Appointment> getUpcomingAppointmentsForLawyer(@PathVariable Long lawyerId) {
        return appointmentService.getUpcomingAppointmentsForLawyer(lawyerId);
    }
}
