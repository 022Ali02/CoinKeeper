package org.example.coinkeeper.repository;

import org.example.coinkeeper.model.Transaction;
import org.example.coinkeeper.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND " +
            "(cast(:startDate as timestamp) IS NULL OR t.date >= :startDate) AND " +
            "(cast(:endDate as timestamp) IS NULL OR t.date <= :endDate)")
    List<Transaction> findByUserAndDateBetween(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    Optional<Transaction> findByIdAndUser(Long id, User user);

}