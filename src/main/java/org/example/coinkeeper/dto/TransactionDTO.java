package org.example.coinkeeper.dto;

import org.example.coinkeeper.model.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;

    @NotNull
    private Transaction type;

    @NotNull
    @Positive
    private BigDecimal amount;

    private Long categoryId;

    @NotNull
    private LocalDateTime date;

    private String comment;
}