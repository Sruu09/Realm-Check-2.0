package com.realmcheck.backend.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.io.IOException;
import java.util.Collections;

/**
 * Simple filter that recognises a hard‑coded mock JWT token used in tests.
 * If the request contains "Authorization: Bearer mock-jwt-token-123" the filter
 * creates an authenticated {@link UsernamePasswordAuthenticationToken} with the role
 * {@code ROLE_USER} and stores it in the {@link SecurityContextHolder}. All other
 * requests are left untouched.
 */
public class MockJwtAuthenticationFilter implements Filter {

    private static final String MOCK_TOKEN = "mock-jwt-token-123";

    @Override
    public void doFilter(jakarta.servlet.ServletRequest servletRequest,
                         jakarta.servlet.ServletResponse servletResponse,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (MOCK_TOKEN.equals(token)) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        "mockUser",
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        chain.doFilter(request, response);
    }
}
