package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.SavingsTransaction;
import com.realmcheck.backend.repository.SavingsTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavingsTransactionService {

    private final SavingsTransactionRepository savingsTransactionRepository;
    private final UserService userService;

    public SavingsTransactionService(SavingsTransactionRepository savingsTransactionRepository, UserService userService) {
        this.savingsTransactionRepository = savingsTransactionRepository;
        this.userService = userService;
    }

    public List<SavingsTransaction> getTransactionsByUserId(Long userId) {
        return savingsTransactionRepository.findByUserId(userId);
    }

    @Transactional
    public SavingsTransaction createTransaction(SavingsTransaction transaction) {
        SavingsTransaction saved = savingsTransactionRepository.save(transaction);
        double amount = "DEPOSIT".equals(saved.getType()) ? saved.getAmount() : -saved.getAmount();
        userService.updateSavings(saved.getUserId(), amount);
        return saved;
    }

    @Transactional
    public SavingsTransaction updateTransaction(Long id, SavingsTransaction newTx) {
        SavingsTransaction existing = savingsTransactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // Reverse old transaction impact
        double reverseAmount = "DEPOSIT".equals(existing.getType()) ? -existing.getAmount() : existing.getAmount();
        userService.updateSavings(existing.getUserId(), reverseAmount);

        // Apply updated transaction details
        existing.setAmount(newTx.getAmount());
        existing.setDescription(newTx.getDescription());
        existing.setCategory(newTx.getCategory());
        existing.setType(newTx.getType());
        
        SavingsTransaction saved = savingsTransactionRepository.save(existing);
        double newAmount = "DEPOSIT".equals(saved.getType()) ? saved.getAmount() : -saved.getAmount();
        userService.updateSavings(saved.getUserId(), newAmount);
        
        return saved;
    }

    @Transactional
    public void deleteTransaction(Long id) {
        savingsTransactionRepository.findById(id).ifPresent(tx -> {
            double amount = "DEPOSIT".equals(tx.getType()) ? -tx.getAmount() : tx.getAmount();
            userService.updateSavings(tx.getUserId(), amount);
            savingsTransactionRepository.delete(tx);
        });
    }
}
