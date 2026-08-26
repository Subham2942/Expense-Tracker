package com.expense.expenseService.service;

import com.expense.expenseService.dto.ExpenseDto;
import com.expense.expenseService.entities.Expense;
import com.expense.expenseService.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Test
    void createExpensePreservesAuthenticatedUserId() {
        ExpenseService expenseService = new ExpenseService(expenseRepository);
        ExpenseDto request = ExpenseDto.builder()
                .amount(new BigDecimal("150.00"))
                .userId("user-123")
                .merchant("Netflix")
                .build();

        assertTrue(expenseService.createExpense(request));

        ArgumentCaptor<Expense> expenseCaptor = ArgumentCaptor.forClass(Expense.class);
        verify(expenseRepository).save(expenseCaptor.capture());
        Expense savedExpense = expenseCaptor.getValue();

        assertEquals("user-123", savedExpense.getUserId());
        assertEquals(new BigDecimal("150.00"), savedExpense.getAmount());
        assertEquals("Netflix", savedExpense.getMerchant());
        assertEquals("INR", savedExpense.getCurrency());
    }

    @Test
    void getExpensesPreservesResponseFields() {
        ExpenseService expenseService = new ExpenseService(expenseRepository);
        Timestamp createdAt = Timestamp.valueOf("2026-08-24 02:30:00");
        Expense expense = new Expense();
        expense.setExternalId("expense-123");
        expense.setAmount(new BigDecimal("150.00"));
        expense.setUserId("user-123");
        expense.setMerchant("Netflix");
        expense.setCurrency("INR");
        expense.setCreatedAt(createdAt);

        when(expenseRepository.findByUserIdOrderByCreatedAtDesc("user-123"))
                .thenReturn(List.of(expense));

        List<ExpenseDto> result = expenseService.getExpenses("user-123");

        assertEquals(1, result.size());
        ExpenseDto response = result.getFirst();
        assertEquals("expense-123", response.getExternalId());
        assertEquals(new BigDecimal("150.00"), response.getAmount());
        assertEquals("user-123", response.getUserId());
        assertEquals("Netflix", response.getMerchant());
        assertEquals("INR", response.getCurrency());
        assertEquals(createdAt, response.getCreatedAt());
    }
}
