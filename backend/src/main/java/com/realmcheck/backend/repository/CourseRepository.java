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

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.tags) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.provider) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Course> searchCourses(@org.springframework.web.bind.annotation.RequestParam("query") @org.springframework.data.repository.query.Param("query") String query);
}
