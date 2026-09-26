package com.realmcheck.backend.repository;

import com.realmcheck.backend.entity.SavingsTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsTransactionRepository extends JpaRepository<SavingsTransaction, Long> {
    List<SavingsTransaction> findByUserId(Long userId);
}
