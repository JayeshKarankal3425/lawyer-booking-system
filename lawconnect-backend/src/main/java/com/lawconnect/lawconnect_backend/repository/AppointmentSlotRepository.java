package com.lawconnect.lawconnect_backend.repository;

import com.lawconnect.lawconnect_backend.models.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot,Long> {
    List<AppointmentSlot> findByLawyerId(long lawyerId);
}
