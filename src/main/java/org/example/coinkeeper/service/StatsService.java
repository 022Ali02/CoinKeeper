package org.example.coinkeeper.service;

import org.example.coinkeeper.dto.StatsResponse;
import org.example.coinkeeper.model.Transaction;
import org.example.coinkeeper.model.User;
import org.example.coinkeeper.repository.TransactionRepository;
import org.example.coinkeeper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public StatsResponse getStats(LocalDate startDate, LocalDate endDate) {
        User user = getCurrentUser();

        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.plusDays(1).atStartOfDay() : null;

        List<Transaction> transactions = transactionRepository.findByUserAndDateBetween(
                user, startDateTime, endDateTime);

        BigDecimal totalIncome = calculateTotal(transactions, Transaction.INCOME);
        BigDecimal totalExpense = calculateTotal(transactions, Transaction.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, BigDecimal> incomeByCategory = groupByCategory(transactions, Transaction.INCOME);
        Map<String, BigDecimal> expenseByCategory = groupByCategory(transactions, Transaction.EXPENSE);

        return new StatsResponse(totalIncome, totalExpense, balance, incomeByCategory, expenseByCategory);
    }

    private BigDecimal calculateTotal(List<Transaction> transactions, Transaction type) {
        return transactions.stream()
                .filter(t -> t.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<String, BigDecimal> groupByCategory(List<Transaction> transactions, Transaction type) {
        return transactions.stream()
                .filter(t -> t.getType() == type && t.getCategory() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getName(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Transaction::getAmount,
                                BigDecimal::add
                        )
                ));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}