package com.lawconnect.lawconnect_backend.services;

import com.lawconnect.lawconnect_backend.models.Appointment;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.AppointmentRepo;
import com.lawconnect.lawconnect_backend.repository.LawyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LawyerService {
    @Autowired
    private UserService userService;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private AppointmentRepo appointmentRepo;

    @Autowired
    private LawyerRepository lawyerRepository;
    public Lawyer addLawyerProfile(Lawyer lawyer) {
        return lawyerRepository.save(lawyer);
    }

    public Lawyer getLawyer(long id){
        Lawyer existingLawyer = lawyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lawyer not fount with id : "+id));
        return existingLawyer;
    }

    public Optional<Lawyer> getLawyerByEmail(String email) {
        return lawyerRepository.findByUserEmail(email);
    }

    public List<Lawyer> getAllLawyers() {
        return lawyerRepository.findAll();
    }

    public Lawyer updateLawyer(long id, Lawyer lawyer) {
        Lawyer newLawyer = getLawyer(id);

        User user = userService.getUser(newLawyer.getUser().getId());
        user.setFirstName(lawyer.getUser().getFirstName());
        user.setLastName(lawyer.getUser().getLastName());
        user.setContactNo(lawyer.getUser().getContactNo());
        user.setEmail(lawyer.getUser().getEmail());
        user.setPassword(lawyer.getUser().getPassword());
        user.setAge(lawyer.getUser().getAge());

        userService.updateUser(user.getEmail(),user);

        newLawyer.setBio(lawyer.getBio());
        newLawyer.setSpecialization(lawyer.getSpecialization());
        newLawyer.setExperience(lawyer.getExperience());
        newLawyer.setRating(lawyer.getRating());
        newLawyer.setUser(user);
        lawyerRepository.save(newLawyer);
        return newLawyer;
    }

    public Lawyer getLawyerByUser(long user) {
        Lawyer existingLawyer = lawyerRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Lawyer not fount with id : "+user));
        return existingLawyer;
    }

    public void rateLawyer(Long appointmentId,Long lawyerId, double rating){
        Lawyer lawyer = getLawyer(lawyerId);
        Appointment appointment = appointmentService.getAppointment(appointmentId);
        if(lawyer.getRatingCount() == 0){
            lawyer.setRating(rating);
            lawyer.setRatingCount(1);
            appointment.setRated(true);
        }
        else{
            double avgRating = (lawyer.getRating()+rating)/2;
            long count = lawyer.getRatingCount() + 1;
            lawyer.setRating(avgRating);
            lawyer.setRatingCount(count);
            appointment.setRated(true);
        }
        appointmentRepo.save(appointment);
        lawyerRepository.save(lawyer);
    }
}
