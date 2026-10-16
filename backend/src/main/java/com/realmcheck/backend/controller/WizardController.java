package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.WizardChatRequest;
import com.realmcheck.backend.dto.WizardChatResponse;
import com.realmcheck.backend.service.WizardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wizard")
@CrossOrigin(origins = "*")
public class WizardController {

    private final WizardService wizardService;

    public WizardController(WizardService wizardService) {
        this.wizardService = wizardService;
    }

    @PostMapping("/chat")
    public ResponseEntity<WizardChatResponse> chat(@RequestBody WizardChatRequest request) {
        if (request == null) {
            request = new WizardChatRequest();
        }
        WizardChatResponse response = wizardService.processChat(request);
        return ResponseEntity.ok(response);
    }
}
