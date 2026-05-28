package com.finwise.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AiInsightResponse {
    private String id;
    private String type;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
