package com.finwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_contributions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private SavingsGoal goal;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "contributed_at")
    private LocalDateTime contributedAt;

    @PrePersist
    protected void onCreate() {
        contributedAt = LocalDateTime.now();
    }
}
