package com.lawconnect.lawconnect_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;
    private final long expMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.exp-ms}") long expMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expMs = expMs;
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // keep your single role string
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return parseAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Object r = parseAllClaims(token).get("role");
        return r == null ? null : r.toString();
    }

    public boolean isValid(String token) {
        try { parseAllClaims(token); return true; }
        catch (JwtException | IllegalArgumentException e) { return false; }
    }

    private Claims parseAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
    }
}

