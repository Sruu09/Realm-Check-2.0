package com.realmcheck.backend.controller;

import com.realmcheck.backend.service.AdzunaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adzuna")
@CrossOrigin(origins = "*")
public class AdzunaController {

    @Autowired
    private AdzunaService adzunaService;

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchJobs(@RequestParam(required = false) String keyword,
                                             @RequestParam(required = false) String location) {
        String jsonResponse = adzunaService.searchJobs(keyword, location);
        return ResponseEntity.ok(jsonResponse);
    }
}
