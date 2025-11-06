package com.lawconnect.lawconnect_backend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity

public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;
    private String status; // PENDING, CONFIRMED, COMPLETED, CANCELLED
    private String meetLink;
    private boolean rated;
    @ManyToOne
    private User client; // the one who booked

    @ManyToOne
    private Lawyer lawyer;

    @OneToOne
    private AppointmentSlot slot; // linked slot

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public String getMeetLink() {
        return meetLink;
    }

    public void setMeetLink(String meetLink) {
        this.meetLink = meetLink;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Lawyer getLawyer() {
        return lawyer;
    }

    public void setLawyer(Lawyer lawyer) {
        this.lawyer = lawyer;
    }

    public AppointmentSlot getSlot() {
        return slot;
    }

    public void setSlot(AppointmentSlot slot) {
        this.slot = slot;
    }

    public boolean isRated() {
        return rated;
    }

    public void setRated(boolean rated) {
        this.rated = rated;
    }
}
