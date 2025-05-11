package org.example.coinkeeper.service;

import org.example.coinkeeper.dto.CategoryDTO;
import org.example.coinkeeper.exception.ResourceNotFoundException;
import org.example.coinkeeper.model.Category;
import org.example.coinkeeper.model.User;
import org.example.coinkeeper.repository.CategoryRepository;
import org.example.coinkeeper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.example.coinkeeper.mapper.CategoryMapper;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        User user = getCurrentUser();
        return categoryRepository.findByUser(user).stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        User user = getCurrentUser();
        Category category = CategoryMapper.toEntity(categoryDTO);
        category.setUser(user);
        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}