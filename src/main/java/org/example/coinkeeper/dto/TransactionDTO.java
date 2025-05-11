package org.example.coinkeeper.dto;

import lombok.Builder;
import org.example.coinkeeper.model.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.example.coinkeeper.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionDTO {
    private Long id;

    @NotNull
    private TransactionType type;

    @NotNull
    @Positive
    private BigDecimal amount;

    private Long categoryId;

    @NotNull
    private LocalDateTime date;

    private String comment;
}