package com.lawconnect.lawconnect_backend.controller;

import com.lawconnect.lawconnect_backend.DTO.*;
import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.UserRepository;
import com.lawconnect.lawconnect_backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtService jwtService;

    @PostMapping("/register")
    @CrossOrigin(origins = "http://localhost:5500", allowCredentials = "true")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req, HttpServletResponse response) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        User u = new User();
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setContactNo(req.getContactNo());
        u.setAge(req.getAge());
        u.setRole(req.getRole().toUpperCase());  // Expect CLIENT or LAWYER
        userRepo.save(u);

        String token = jwtService.generateToken(u.getEmail(), u.getRole());

        // ✅ Assign cookie name based on role
        String cookieName = u.getRole().equals("LAWYER") ? "lawyerToken" : "userToken";

        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new JwtResponse(token, u.getEmail(), u.getRole()));
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5500", allowCredentials = "true")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req, HttpServletResponse response) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User u = userRepo.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtService.generateToken(u.getEmail(), u.getRole());

        // ✅ Role-based cookie
        String cookieName = u.getRole().equals("LAWYER") ? "lawyerToken" : "userToken";

        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new JwtResponse(token, u.getEmail(), u.getRole()));
    }

    // ✅ Logout endpoint (clears both tokens)
    @CrossOrigin(origins = "http://localhost:5500", allowCredentials = "true")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie deleteLawyer = ResponseCookie.from("lawyerToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie deleteUser = ResponseCookie.from("userToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteLawyer.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteUser.toString());

        return ResponseEntity.ok("Logged out successfully.");
    }
}
