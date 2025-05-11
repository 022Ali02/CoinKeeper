package org.example.coinkeeper.mapper;

import org.example.coinkeeper.dto.CategoryDTO;
import org.example.coinkeeper.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface categoryMapper {

    @Mapping(target = "userId", source = "user.id")
    static CategoryDTO toDTO(Category category) {
        return null;
    }

    @Mapping(target = "user", ignore = true) // User will be set separately in service
    @Mapping(target = "transactions", ignore = true)
    static // Transactions are managed separately
    Category toEntity(CategoryDTO categoryDTO) {
        return null;
    }
}