package org.example.coinkeeper.dto;
import org.example.coinkeeper.model.Transaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long userId;

    @NotBlank
    private String name;

    private String icon;

    private String color;

    @NotNull
    private Transaction type;
}