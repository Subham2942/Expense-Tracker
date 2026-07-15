package com.expense.expenseService.repository;

import com.expense.expenseService.entities.Expense;
import org.jspecify.annotations.NonNull;
import org.springframework.data.repository.CrudRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends CrudRepository<Expense, Long> {

    List<Expense> findByUserId(String userId);

    List<Expense> findByUserIdAndCreatedAtBetween(String userId, Timestamp startTime, Timestamp endTime);

    Optional<Expense> findByUserIdAndExternalId(String userId, String externalId);

    void delete(@NonNull Expense expense);



}