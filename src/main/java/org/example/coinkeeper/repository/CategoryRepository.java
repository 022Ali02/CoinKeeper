package org.example.coinkeeper.repository;

import org.example.coinkeeper.model.Category;
import org.example.coinkeeper.model.User;
import org.example.coinkeeper.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByIdAndUser(Long id, User user);

    List<Category> findByUser(User user);

    List<Category> findByUserAndType(User user, Transaction type); // Changed parameter type
}