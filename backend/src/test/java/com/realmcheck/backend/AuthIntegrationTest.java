package com.realmcheck.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.web.server.LocalServerPort;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)

@Disabled public class AuthIntegrationTest {
    @LocalServerPort
    private int port;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        this.webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .responseTimeout(java.time.Duration.ofSeconds(15))
                .build();
    }

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void registrationAndLoginAndProtectedEndpoint() throws Exception {
        // Register a new user
        String registerJson = "{\"email\":\"testuser@example.com\",\"password\":\"testpass\",\"name\":\"Test User\"}";
        String regBody = webTestClient.post()
                .uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(registerJson)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();
        assertThat(regBody).contains("mock-jwt-token-123");

        // Login the same user
        String loginJson = "{\"email\":\"testuser@example.com\",\"password\":\"testpass\"}";
        String loginBody = webTestClient.post()
                .uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(loginJson)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();
        assertThat(loginBody).contains("mock-jwt-token-123");
        String token = "mock-jwt-token-123";

        // Unauthenticated request should be 401
        webTestClient.get()
                .uri("/api/recommendations/jobs")
                .exchange()
                .expectStatus().isUnauthorized();

        // Authenticated request should be 200
        webTestClient.get()
                .uri("/api/recommendations/jobs")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .exchange()
                .expectStatus().isOk();
    }
}
