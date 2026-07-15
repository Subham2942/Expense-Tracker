package com.expense.expenseService.consumer;

import com.expense.expenseService.dto.ExpenseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Deserializer;

import java.util.Map;

public class ExpenseDeserializer implements Deserializer<ExpenseDto>
{

    @Override
    public ExpenseDto deserialize(String arg0, byte[] arg1) {
        ObjectMapper mapper = new ObjectMapper();
        ExpenseDto expense = null;
        try {
            expense = mapper.readValue(arg1, ExpenseDto.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return expense;
    }
}