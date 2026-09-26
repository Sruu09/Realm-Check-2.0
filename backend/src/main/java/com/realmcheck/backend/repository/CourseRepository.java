package com.realmcheck.backend.repository;

import com.realmcheck.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTitleContainingIgnoreCase(String keyword);
    List<Course> findByCategoryIgnoreCase(String category);
    List<Course> findByProviderIgnoreCase(String provider);
    List<Course> findByLevelIgnoreCase(String level);
}
