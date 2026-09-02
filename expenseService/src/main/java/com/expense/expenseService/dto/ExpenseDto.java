package com.expense.expenseService.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;
import tools.jackson.databind.json.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExpenseDto
{

    @JsonProperty(value = "external_id")
    private String externalId;

    @JsonProperty(value = "amount")
    @NonNull
    private BigDecimal amount;

    @JsonProperty(value = "user_id")
    private String userId;

    @JsonProperty(value = "merchant")
    private String merchant;

    @JsonProperty(value = "currency")
    private String currency;

    @JsonProperty(value = "created_at")
    private Timestamp createdAt;

    public ExpenseDto(String json) {
        try {
            ObjectMapper mapper = JsonMapper.builder()
                    .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                    .build();
            ExpenseDto expense = mapper.readValue(json, ExpenseDto.class);
            this.externalId = expense.externalId;
            this.amount = expense.amount;
            this.userId = expense.userId;
            this.merchant = expense.merchant;
            this.currency = expense.currency;
            this.createdAt = expense.createdAt;
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize ExpenseDto from JSON", e);
        }
    }

}
