package com.lawconnect.lawconnect_backend.DTO;

public class RatingDTO {
    private Long lawyerId;
    private double rating; // 1 to 5
    private long appointmentId;
    // getter & setter

    public Long getLawyerId() {
        return lawyerId;
    }

    public void setLawyerId(Long lawyerId) {
        this.lawyerId = lawyerId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(long appointmentId) {
        this.appointmentId = appointmentId;
    }
}
