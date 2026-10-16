package com.realmcheck.backend.controller;

import com.realmcheck.backend.service.PetAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "*")
public class PetController {

    private final PetAiService petAiService;

    public PetController(PetAiService petAiService) {
        this.petAiService = petAiService;
    }

    @GetMapping("/message")
    public ResponseEntity<Map<String, String>> getPetMessage(@RequestParam(value = "prompt", required = false) String prompt) {
        String reply = petAiService.getPetResponse(prompt);
        return ResponseEntity.ok(Map.of("message", reply));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithPet(@RequestBody(required = false) Map<String, String> body) {
        String prompt = (body != null) ? body.get("message") : null;
        String reply = petAiService.getPetResponse(prompt);
        return ResponseEntity.ok(Map.of("message", reply));
    }
}
