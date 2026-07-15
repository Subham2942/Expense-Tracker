package com.expense.expenseService.controller;

import com.expense.expenseService.dto.ExpenseDto;
import com.expense.expenseService.service.ExpenseService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense/v1")
public class ExpenseController
{

    private final ExpenseService expenseService;

    @Autowired
    ExpenseController(ExpenseService expenseService){
        this.expenseService = expenseService;
    }

    @GetMapping(path = "/getExpense")
    public ResponseEntity<List<ExpenseDto>> getExpense(@RequestParam(value = "user_id") @NonNull String userId){
        try{
            List<ExpenseDto> expenseDtoList = expenseService.getExpenses(userId);
            return new ResponseEntity<>(expenseDtoList, HttpStatus.OK);
        }catch(Exception ex){
            return new ResponseEntity<>((HttpHeaders) null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path="/addExpense")
    public ResponseEntity<Boolean> addExpenses(@RequestHeader(value = "X-User-Id") @NonNull String userId, ExpenseDto expenseDto){
        try{
            expenseDto.setUserId(userId);
            return new ResponseEntity<>(expenseService.createExpense(expenseDto), HttpStatus.OK);
        }catch (Exception ex){
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(path="/updateExpens")
    public ResponseEntity<Boolean> updateExpense(@RequestHeader(value = "X-User-Id") @NonNull String userId, @NonNull ExpenseDto expenseDto){
        try{
            boolean success = expenseService.updateExpense(expenseDto);
            return new ResponseEntity<>(true, success ? HttpStatus.OK :  HttpStatus.NOT_FOUND);
        }catch (Exception ex){
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(path = "/deleteExpense")
    public ResponseEntity<Boolean> deleteExpense(@RequestParam(value = "user_id") @NonNull String userId, @NonNull ExpenseDto expenseDto){
        try{
            boolean success = expenseService.deleteExpense(expenseDto);

            return new ResponseEntity<>(true, success ? HttpStatus.OK :  HttpStatus.NOT_FOUND);

        }
        catch (Exception ex){
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }

    }

}