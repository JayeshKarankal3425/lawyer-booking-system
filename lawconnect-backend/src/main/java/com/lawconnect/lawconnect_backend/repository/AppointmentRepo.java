package com.lawconnect.lawconnect_backend.repository;

import com.lawconnect.lawconnect_backend.DTO.AppointmentStatus;
import com.lawconnect.lawconnect_backend.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment,Long> {
    List<Appointment> findByLawyerId(long id);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByClientId(long id);
    List<Appointment> findByClientIdAndStatusAndAppointmentTimeAfter(
            Long clientId,
            String status,
            LocalTime now
    );

    List<Appointment> findByLawyerIdAndStatusAndAppointmentTimeAfter(
            Long lawyerId,
            String status,
            LocalDateTime now
    );
}
