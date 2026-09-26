package com.realmcheck.backend.service;

import com.realmcheck.backend.dto.ScholarshipDTO;
import com.realmcheck.backend.entity.Scholarship;
import com.realmcheck.backend.repository.ScholarshipRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    private ScholarshipDTO toDto(Scholarship s) {
        ScholarshipDTO dto = new ScholarshipDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setProvider(s.getProvider());
        dto.setDescription(s.getDescription());
        dto.setEligibility(s.getEligibility());
        dto.setAmount(s.getAmount());
        dto.setDeadline(s.getDeadline());
        dto.setLevel(s.getLevel());
        dto.setField(s.getField());
        dto.setLocation(s.getLocation());
        dto.setApplicationUrl(s.getApplicationUrl());
        dto.setStatus(s.getStatus());
        return dto;
    }

    public List<ScholarshipDTO> getAll() {
        return scholarshipRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScholarshipDTO> search(String keyword) {
        return scholarshipRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScholarshipDTO> filterByProvider(String provider) {
        return scholarshipRepository.findByProviderContainingIgnoreCase(provider).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScholarshipDTO> filterByField(String field) {
        return scholarshipRepository.findByFieldIgnoreCase(field).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScholarshipDTO> filterByLevel(String level) {
        return scholarshipRepository.findByLevelIgnoreCase(level).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScholarshipDTO> filterByStatus(String status) {
        return scholarshipRepository.findByStatusIgnoreCase(status).stream().map(this::toDto).collect(Collectors.toList());
    }
}
