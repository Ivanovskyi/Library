package com.library.Library.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtService {

    private final String SECRET = "your_super_secret_key_that_is_at_least_32_bytes_long_for_security";

    public String generateToken(String username, String role) {
        return Jwts.builder().subject(username)
                .claim("role", role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder().subject(username)
                .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + 604800000)) // 7 days
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build().parseSignedClaims(token).getPayload();
    }
}