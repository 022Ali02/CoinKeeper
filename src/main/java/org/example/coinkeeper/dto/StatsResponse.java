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
    public StatsResponse(BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance,
                         Map<String, BigDecimal> incomeByCategory, Map<String, BigDecimal> expenseByCategory) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.incomeByCategory = incomeByCategory;
        this.expenseByCategory = expenseByCategory;
    }
}