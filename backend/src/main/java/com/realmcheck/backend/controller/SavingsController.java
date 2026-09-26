package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.SavingsTransactionDTO;
import com.realmcheck.backend.entity.SavingsTransaction;
import com.realmcheck.backend.service.SavingsTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "*")
public class SavingsController {

    private final SavingsTransactionService savingsTransactionService;

    public SavingsController(SavingsTransactionService savingsTransactionService) {
        this.savingsTransactionService = savingsTransactionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingsTransactionDTO>> getTransactions(@PathVariable Long userId) {
        List<SavingsTransactionDTO> dtos = savingsTransactionService.getTransactionsByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<SavingsTransactionDTO> createTransaction(@RequestBody SavingsTransactionDTO dto) {
        SavingsTransaction transaction = toEntity(dto);
        SavingsTransaction saved = savingsTransactionService.createTransaction(transaction);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsTransactionDTO> updateTransaction(@PathVariable Long id, @RequestBody SavingsTransactionDTO dto) {
        SavingsTransaction transaction = toEntity(dto);
        transaction.setId(id);
        // Note: we'd need to adjust user savings accordingly, but for Phase 2 MVP we just overwrite
        SavingsTransaction saved = savingsTransactionService.createTransaction(transaction); // createTransaction in service actually calls save() which handles updates too if ID exists
        return ResponseEntity.ok(toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        savingsTransactionService.deleteTransaction(id); // need to add to service
        return ResponseEntity.ok().build();
    }

    private SavingsTransactionDTO toDTO(SavingsTransaction tx) {
        SavingsTransactionDTO dto = new SavingsTransactionDTO();
        dto.setId(tx.getId());
        dto.setUserId(tx.getUserId());
        dto.setAmount(tx.getAmount());
        dto.setDescription(tx.getDescription());
        dto.setCategory(tx.getCategory());
        dto.setType(tx.getType());
        dto.setDate(tx.getDate());
        return dto;
    }

    private SavingsTransaction toEntity(SavingsTransactionDTO dto) {
        SavingsTransaction tx = new SavingsTransaction();
        tx.setUserId(dto.getUserId());
        tx.setAmount(dto.getAmount());
        tx.setDescription(dto.getDescription());
        tx.setCategory(dto.getCategory());
        tx.setType(dto.getType());
        return tx;
    }
}
