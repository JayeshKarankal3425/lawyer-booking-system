package com.lawconnect.lawconnect_backend.security;

import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // map String role (e.g. "CLIENT") -> Spring authority "ROLE_CLIENT"
        String authority = "ROLE_" + u.getRole();
//        System.out.println(u.getEmail());
//        System.out.println(u.getPassword());
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority(authority))
        );
    }
}
