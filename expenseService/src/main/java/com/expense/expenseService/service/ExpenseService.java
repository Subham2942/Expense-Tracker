package com.expense.expenseService.service;

import com.expense.expenseService.dto.ExpenseDto;
import com.expense.expenseService.entities.Expense;
import com.expense.expenseService.repository.ExpenseRepository;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ExpenseService
{

    private final ExpenseRepository expenseRepository;

    @Autowired
    ExpenseService(ExpenseRepository expenseRepository){
        this.expenseRepository = expenseRepository;
    }

    public boolean createExpense(ExpenseDto expenseDto){
        setCurrency(expenseDto);
        if (expenseDto.getAmount().signum() <= 0) {
            return false;
        }
        try{
            expenseRepository.save(toEntity(expenseDto));
            return true;
        }catch(Exception ex){
            return false;
        }
    }

    public boolean updateExpense(ExpenseDto expenseDto){
        if (expenseDto.getExternalId() == null || expenseDto.getAmount().signum() <= 0) {
            return false;
        }
        Optional<Expense> expenseFoundOpt = expenseRepository.findByUserIdAndExternalId(expenseDto.getUserId(), expenseDto.getExternalId());
        if(expenseFoundOpt.isEmpty()){
            return false;
        }
        Expense expense = expenseFoundOpt.get();
        expense.setAmount(expenseDto.getAmount());
        expense.setMerchant(Strings.isNotBlank(expenseDto.getMerchant())?expenseDto.getMerchant():expense.getMerchant());
        expense.setCurrency(Strings.isNotBlank(expenseDto.getCurrency())?expenseDto.getCurrency():expense.getCurrency());
        expenseRepository.save(expense);
        return true;
    }

    public boolean deleteExpense(String userId, String externalId){
        if (Strings.isBlank(userId) || Strings.isBlank(externalId)) {
            return false;
        }
        Optional<Expense> expenseFoundOpt = expenseRepository.findByUserIdAndExternalId(userId, externalId);
        if(expenseFoundOpt.isEmpty()){
            return false;
        }
        expenseRepository.delete(expenseFoundOpt.get());
        return true;
    }

    public List<ExpenseDto> getExpenses(String userId){
        return expenseRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private void setCurrency(ExpenseDto expenseDto){
        if(Objects.isNull(expenseDto.getCurrency()) || expenseDto.getCurrency().isBlank()){
            expenseDto.setCurrency("INR");
        }
    }

    private Expense toEntity(ExpenseDto expenseDto){
        Expense expense = new Expense();
        expense.setExternalId(expenseDto.getExternalId());
        expense.setAmount(expenseDto.getAmount());
        expense.setUserId(expenseDto.getUserId());
        expense.setMerchant(expenseDto.getMerchant());
        expense.setCurrency(expenseDto.getCurrency());
        expense.setCreatedAt(expenseDto.getCreatedAt());
        return expense;
    }

    private ExpenseDto toDto(Expense expense){
        return ExpenseDto.builder()
                .externalId(expense.getExternalId())
                .amount(expense.getAmount())
                .userId(expense.getUserId())
                .merchant(expense.getMerchant())
                .currency(expense.getCurrency())
                .createdAt(expense.getCreatedAt())
                .build();
    }


}
