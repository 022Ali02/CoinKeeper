package org.example.coinkeeper.mapper;

import org.example.coinkeeper.dto.TransactionDTO;
import org.example.coinkeeper.model.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {
    public TransactionDTO toDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .date(transaction.getDate())
                .comment(transaction.getComment())
                .categoryId(transaction.getCategory() != null ? transaction.getCategory().getId() : null)
                .build();
    }

    public Transaction toEntity(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setId(transactionDTO.getId());
        transaction.setType(transactionDTO.getType());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setComment(transactionDTO.getComment());
        // Категория устанавливается отдельно в сервисе
        return transaction;
    }
}