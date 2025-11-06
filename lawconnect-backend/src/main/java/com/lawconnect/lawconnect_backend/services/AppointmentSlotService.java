package com.lawconnect.lawconnect_backend.services;

import com.lawconnect.lawconnect_backend.models.AppointmentSlot;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.AppointmentSlotRepository;
import com.lawconnect.lawconnect_backend.repository.LawyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.availability.AvailabilityState;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin("")
public class AppointmentSlotService {
    @Autowired
    private LawyerRepository lawyerRepository;
    @Autowired
    private AppointmentSlotRepository appointmentSlotRepository;
    public AppointmentSlot createSlot(AppointmentSlot slot, User user) {

        Optional<Lawyer> lawyerOptional = lawyerRepository.findByUserEmail(user.getEmail());
        Lawyer lawyer = lawyerOptional.orElseThrow(()->new RuntimeException("Lawyer not found"));
        slot.setLawyer(lawyer);
        return appointmentSlotRepository.save(slot);
    }

    public List<AppointmentSlot> getAllAppointmentOfLawyer(long lawyerId) {
        return appointmentSlotRepository.findByLawyerId(lawyerId);
    }
    public List<AppointmentSlot> getAvailableAppointmentSlots(long id){
        List<AppointmentSlot> slots = appointmentSlotRepository.findByLawyerId(id);
        List<AppointmentSlot> availableSlots = new ArrayList<>();
        for(AppointmentSlot slot : slots){
            if(slot.getStatus().equals("AVAILABLE")){
                availableSlots.add(slot);
            }
        }
        return availableSlots;
    }
}
