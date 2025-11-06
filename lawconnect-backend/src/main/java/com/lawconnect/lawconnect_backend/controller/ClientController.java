package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.models.Lawyer;
import com.lawconnect.lawconnect_backend.services.LawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    private LawyerService lawyerService;

    @GetMapping("/getAllLawyer/profile")
    public List<Lawyer> getLawyerProfile(){
        List<Lawyer> lawyers = lawyerService.getAllLawyers();
        return lawyers;
    }
    @GetMapping("/getLawyer/profile/{id}")
    public Lawyer getLawyerProfile(@PathVariable long id){
        Lawyer lawyer = lawyerService.getLawyer(id);
        return lawyer;
    }
}
