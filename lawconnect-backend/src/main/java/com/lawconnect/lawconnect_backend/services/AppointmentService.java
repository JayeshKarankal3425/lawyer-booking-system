package com.lawconnect.lawconnect_backend.services;

import com.lawconnect.lawconnect_backend.models.Appointment;
import com.lawconnect.lawconnect_backend.models.AppointmentSlot;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.AppointmentRepo;
import com.lawconnect.lawconnect_backend.repository.AppointmentSlotRepository;
import com.lawconnect.lawconnect_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    AppointmentRepo appointmentRepo;
    @Autowired
    UserRepository userRepository;

    @Autowired
    AppointmentSlotRepository appointmentSlotRepository;
    public boolean bookAppointment(long slotId, String email) {
        AppointmentSlot appointmentSlot = appointmentSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found with id : "+ slotId));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("user not found with id : "+ email));
        if(appointmentSlot == null || user == null){
            return false;
        }

        if(!"AVAILABLE".equalsIgnoreCase(appointmentSlot.getStatus())){
            return false;
        }

        //Create appointment
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(appointmentSlot.getDate());
        appointment.setAppointmentTime(appointmentSlot.getStartTime());
        appointment.setSlot(appointmentSlot);
        appointment.setLawyer(appointmentSlot.getLawyer());
        appointment.setStatus("PENDING");
        appointment.setClient(user);

        //update slot status
        appointmentSlot.setStatus("BOOKED");
        appointmentSlotRepository.save(appointmentSlot);

        //save appointment
        appointmentRepo.save(appointment);
        return true;
    }

    public List<Appointment> getAllAppointments(long id){
        List<Appointment> appointments = appointmentRepo.findByLawyerId(id);
        return appointments;
    }

    public void updateStatus(Appointment appointment) {
        appointmentRepo.save(appointment);
    }

    public List<Appointment> getAppointments(String status) {
        return appointmentRepo.findByStatus(status);
    }

    public List<Appointment> getAllAppointmentsUser(long id) {
        List<Appointment> appointments =  appointmentRepo.findByClientId(id);
        return appointments;
    }

    public Appointment getAppointment(long appointmentId) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return appointment;
    }

    public List<Appointment> getUpcomingAppointmentsForClient(Long clientId) {
        return appointmentRepo.findByClientIdAndStatusAndAppointmentTimeAfter(
                clientId,
                "CONFIRMED",
                LocalTime.now()
        );
    }

    public List<Appointment> getUpcomingAppointmentsForLawyer(Long lawyerId) {
        return appointmentRepo.findByLawyerIdAndStatusAndAppointmentTimeAfter(
                lawyerId,
                "CONFIRMED",
                LocalDateTime.now()
        );
    }
}
