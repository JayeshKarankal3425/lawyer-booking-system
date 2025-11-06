    package com.lawconnect.lawconnect_backend.controller;
    import com.lawconnect.lawconnect_backend.models.Lawyer;
    import com.lawconnect.lawconnect_backend.models.User;
    import com.lawconnect.lawconnect_backend.repository.LawyerRepository;
    import com.lawconnect.lawconnect_backend.repository.UserRepository;
    import com.lawconnect.lawconnect_backend.services.AppointmentService;
    import com.lawconnect.lawconnect_backend.services.LawyerService;
    import com.lawconnect.lawconnect_backend.services.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;
    import java.util.List;
    import java.util.Map;
    import java.util.Optional;
    @RestController
    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @RequestMapping("/api/lawyer")
    public class LawyerController {
        @Autowired
        private LawyerService lawyerService;
        @Autowired
        private UserService userService;
        @Autowired
        private AppointmentService appointmentService;
        @Autowired
        LawyerRepository lawyerRepository;
        @Autowired
        UserRepository userRepository;

        @GetMapping("/get/{lawyerId}")
        public Lawyer getLawyer(@PathVariable("lawyerId") long id){
            return lawyerService.getLawyer(id);
        }

        @GetMapping("/getlawyer")
        public ResponseEntity<?> getLawyerByUserEmail(Authentication authentication) {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOpt.get();
            Optional<Lawyer> lawyerOpt = lawyerRepository.findByUserId(user.getId());

            if (lawyerOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(Map.of("message", "Lawyer profile not created yet"));
            }

            return ResponseEntity.ok(lawyerOpt.get());
        }
        @PostMapping("/create")
        public ResponseEntity<?> createProfile(Authentication authentication,@RequestBody Lawyer lawyerRequest){
            String email = authentication.getName();
            User userOpt = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
            if(lawyerRepository.findByUserId(userOpt.getId()).isPresent()){
                return ResponseEntity.badRequest().body("Lawyer Profile Already exist");
            }
            Lawyer lawyer = new Lawyer();
            lawyer.setUser(userOpt);
            lawyer.setSpecialization(lawyerRequest.getSpecialization());
            lawyer.setExperience(lawyerRequest.getExperience());
            lawyer.setBio(lawyerRequest.getBio());
            lawyer.setRating(lawyerRequest.getRating());

            Lawyer saved = lawyerService.addLawyerProfile(lawyer);
            return ResponseEntity.ok(saved);
        }
        @PutMapping("/{lawyerId}/update")
        public ResponseEntity<Lawyer> updateLawyer(
                @PathVariable Long lawyerId,
                @RequestBody Lawyer updatedLawyer) {
            Lawyer lawyer = lawyerService.updateLawyer(lawyerId, updatedLawyer);
            return ResponseEntity.ok(lawyer);
        }


    }
