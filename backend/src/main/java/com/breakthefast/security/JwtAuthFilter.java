package com.breakthefast.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && jwtUtil.isTokenValid(token)) {
            String subject = jwtUtil.getSubject(token);
            String role = jwtUtil.getRole(token);

            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
            var authToken = new UsernamePasswordAuthenticationToken(subject, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        // 1. Check HttpOnly cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("btf_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // 2. Fallback: Authorization header (Bearer token)
        String bearerHeader = request.getHeader("Authorization");
        if (bearerHeader != null && bearerHeader.startsWith("Bearer ")) {
            return bearerHeader.substring(7);
        }

        return null;
    }
}
