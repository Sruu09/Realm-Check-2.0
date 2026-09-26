package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.JournalEntry;
import com.realmcheck.backend.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final UserService userService;

    public JournalEntryService(JournalEntryRepository journalEntryRepository, UserService userService) {
        this.journalEntryRepository = journalEntryRepository;
        this.userService = userService;
    }

    public List<JournalEntry> getEntriesByUserId(Long userId) {
        return journalEntryRepository.findByUserId(userId);
    }

    @Transactional
    public JournalEntry createEntry(JournalEntry entry) {
        JournalEntry saved = journalEntryRepository.save(entry);
        userService.updateMood(saved.getUserId(), saved.getMood());
        return saved;
    }

    public void deleteEntry(Long id) {
        journalEntryRepository.deleteById(id);
    }
}
