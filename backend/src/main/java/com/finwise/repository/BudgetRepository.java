package com.finwise.repository;

import com.finwise.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByUserId(String userId);
    List<Budget> findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            String userId, LocalDate date1, LocalDate date2);
}
