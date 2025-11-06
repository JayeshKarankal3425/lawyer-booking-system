package com.lawconnect.lawconnect_backend.DTO;

import lombok.Data;

@Data
public class BookingDTO {
    private long slotId;
//    private long userId;
    public long getSlotId() {
        return slotId;
    }

    public void setSlotId(long slotId) {
        this.slotId = slotId;
    }

//    public long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(long userId) {
//        this.userId = userId;
//    }
}
