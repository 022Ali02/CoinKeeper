package org.example.coinkeeper.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class StatsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private Map<String, BigDecimal> incomeByCategory;
    private Map<String, BigDecimal> expenseByCategory;
}