package com.lawconnect.lawconnect_backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class AppointmentSlot{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private LocalDate date;

        private LocalTime startTime;

        private LocalTime endTime;
        private String status; // AVAILABLE, BOOKED, CANCELLED
        @Column(name = "charges")
        private double charges;
        @ManyToOne
        private Lawyer lawyer;

        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public LocalDate getDate() {
                return date;
        }

        public void setDate(LocalDate date) {
                this.date = date;
        }

        public LocalTime getStartTime() {
                return startTime;
        }

        public void setStartTime(LocalTime startTime) {
                this.startTime = startTime;
        }

        public LocalTime getEndTime() {
                return endTime;
        }

        public void setEndTime(LocalTime endTime) {
                this.endTime = endTime;
        }

        public String getStatus() {
                return status;
        }

        public void setStatus(String status) {
                this.status = status;
        }

        public Lawyer getLawyer() {
                return lawyer;
        }

        public void setLawyer(Lawyer lawyer) {
                this.lawyer = lawyer;
        }

        public double getCharges() {
                return charges;
        }

        public void setCharges(double charges) {
                this.charges = charges;
        }
}


