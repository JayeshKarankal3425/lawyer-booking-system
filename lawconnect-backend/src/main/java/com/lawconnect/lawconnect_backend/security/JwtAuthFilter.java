package com.lawconnect.lawconnect_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired private JwtService jwtService;
    @Autowired private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String token = null, email = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            if (jwtService.isValid(token)) {
                email = jwtService.extractEmail(token);
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails ud = userDetailsService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
