package com.finwise.repository;

import com.finwise.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiInsightRepository extends JpaRepository<AiInsight, String> {
    List<AiInsight> findByUserIdOrderByCreatedAtDesc(String userId);
    List<AiInsight> findByUserIdAndIsReadFalse(String userId);
}
