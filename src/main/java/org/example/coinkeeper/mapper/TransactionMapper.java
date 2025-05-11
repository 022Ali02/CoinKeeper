package org.example.coinkeeper.mapper;

import org.example.coinkeeper.dto.TransactionDTO;
import org.example.coinkeeper.model.Transaction;
import org.example.coinkeeper.model.TransactionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface TransactionMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "type", source = "type")
    TransactionDTO toDTO(Transaction transaction);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "user", ignore = true)
    Transaction toEntity(TransactionDTO transactionDTO);

    default TransactionType mapTransactionType(String value) {
        return value != null ? TransactionType.valueOf(value) : null;
    }
}