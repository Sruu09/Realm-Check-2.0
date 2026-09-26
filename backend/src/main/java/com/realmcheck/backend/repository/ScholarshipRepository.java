package com.realmcheck.backend.repository;

import com.realmcheck.backend.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByNameContainingIgnoreCase(String keyword);
    List<Scholarship> findByProviderContainingIgnoreCase(String provider);
    List<Scholarship> findByFieldIgnoreCase(String field);
    List<Scholarship> findByLevelIgnoreCase(String level);
    List<Scholarship> findByStatusIgnoreCase(String status);
}
