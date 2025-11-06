package com.lawconnect.lawconnect_backend.DTO;

import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.models.Lawyer;
import lombok.Data;

@Data
public class LawyerProfileDTO {
    private Long id;
    private String specialization;
    private int experience;
    private String bio;
    private double rating;
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LawyerProfileDTO(Lawyer lawyer) {
        this.id = lawyer.getId();
        this.specialization = lawyer.getSpecialization();
        this.experience = lawyer.getExperience();
        this.bio = lawyer.getBio();
        this.rating = lawyer.getRating();
        this.user = lawyer.getUser();
    }
}
