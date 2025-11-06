package com.lawconnect.lawconnect_backend.repository;

import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LawyerRepository extends JpaRepository<Lawyer,Long> {
    Optional<Lawyer> findByUserEmail(String email);
    Optional<Lawyer> findByUserId(long user);
}
