package org.example.coinkeeper.service;

import org.example.coinkeeper.dto.TransactionDTO;
import org.example.coinkeeper.exception.ResourceNotFoundException;
import org.example.coinkeeper.mapper.TransactionMapper;
import org.example.coinkeeper.model.Transaction;
import org.example.coinkeeper.model.User;
import org.example.coinkeeper.repository.CategoryRepository;
import org.example.coinkeeper.repository.TransactionRepository;
import org.example.coinkeeper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        User user = getCurrentUser();
        return transactionRepository.findByUser(user).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        User user = getCurrentUser();
        Transaction transaction = transactionMapper.toEntity(transactionDTO);
        transaction.setUser(user);

        if (transactionDTO.getCategoryId() != null) {
            transaction.setCategory(categoryRepository.findByIdAndUser(
                            transactionDTO.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        User user = getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setType(transactionDTO.getType().getType());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setComment(transactionDTO.getComment());

        if (transactionDTO.getCategoryId() != null) {
            transaction.setCategory(categoryRepository.findByIdAndUser(
                            transactionDTO.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        } else {
            transaction.setCategory(null);
        }

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public void deleteTransaction(Long id) {
        User user = getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}