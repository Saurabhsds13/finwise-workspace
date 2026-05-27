package com.finwise.repository;

import com.finwise.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    List<Expense> findByUserIdOrderByExpenseDateDesc(String userId);
    List<Expense> findByUserIdAndCategory(String userId, String category);
    List<Expense> findByUserIdAndExpenseDateBetween(String userId, LocalDate start, LocalDate end);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> getCategoryTotals(String userId, LocalDate start, LocalDate end);
}
