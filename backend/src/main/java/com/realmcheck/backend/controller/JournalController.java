package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.JournalEntryDTO;
import com.realmcheck.backend.entity.JournalEntry;
import com.realmcheck.backend.service.JournalEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/journals")
@CrossOrigin(origins = "*")
public class JournalController {

    private final JournalEntryService journalEntryService;

    public JournalController(JournalEntryService journalEntryService) {
        this.journalEntryService = journalEntryService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JournalEntryDTO>> getEntries(@PathVariable Long userId) {
        List<JournalEntryDTO> dtos = journalEntryService.getEntriesByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<JournalEntryDTO> createEntry(@RequestBody JournalEntryDTO dto) {
        JournalEntry entry = toEntity(dto);
        JournalEntry saved = journalEntryService.createEntry(entry);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntryDTO> updateEntry(@PathVariable Long id, @RequestBody JournalEntryDTO dto) {
        JournalEntry entry = toEntity(dto);
        entry.setId(id);
        JournalEntry saved = journalEntryService.createEntry(entry);
        return ResponseEntity.ok(toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        journalEntryService.deleteEntry(id);
        return ResponseEntity.ok().build();
    }

    private JournalEntryDTO toDTO(JournalEntry entry) {
        JournalEntryDTO dto = new JournalEntryDTO();
        dto.setId(entry.getId());
        dto.setUserId(entry.getUserId());
        dto.setContent(entry.getContent());
        dto.setMood(entry.getMood());
        dto.setDate(entry.getDate());
        dto.setTags(entry.getTags());
        return dto;
    }

    private JournalEntry toEntity(JournalEntryDTO dto) {
        JournalEntry entry = new JournalEntry();
        entry.setUserId(dto.getUserId());
        entry.setContent(dto.getContent());
        entry.setMood(dto.getMood());
        entry.setTags(dto.getTags());
        return entry;
    }
}
