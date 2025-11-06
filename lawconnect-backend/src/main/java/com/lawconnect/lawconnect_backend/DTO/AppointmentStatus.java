package com.lawconnect.lawconnect_backend.DTO;

import lombok.Data;

@Data
public class AppointmentStatus {
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
