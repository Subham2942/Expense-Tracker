package com.expense.expenseService.service;

import com.expense.expenseService.dto.ExpenseDto;
import com.expense.expenseService.entities.Expense;
import com.expense.expenseService.repository.ExpenseRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    ExpenseService(ExpenseRepository expenseRepository){
        this.expenseRepository = expenseRepository;
    }

    public boolean createExpense(ExpenseDto expenseDto){
        setCurrency(expenseDto);
        if (expenseDto.getAmount() == null || expenseDto.getAmount().signum() <= 0) {
            return false;
        }
        try{
            expenseRepository.save(objectMapper.convertValue(expenseDto, Expense.class));
            return true;
        }catch(Exception ex){
            return false;
        }
    }

    public boolean updateExpense(ExpenseDto expenseDto){
        if (expenseDto.getExternalId() == null || expenseDto.getAmount() == null || expenseDto.getAmount().signum() <= 0) {
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
        List<Expense> expenseOpt = expenseRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return objectMapper.convertValue(expenseOpt, new TypeReference<List<ExpenseDto>>() {});
    }

    private void setCurrency(ExpenseDto expenseDto){
        if(Objects.isNull(expenseDto.getCurrency()) || expenseDto.getCurrency().isBlank()){
            expenseDto.setCurrency("INR");
        }
    }


}
