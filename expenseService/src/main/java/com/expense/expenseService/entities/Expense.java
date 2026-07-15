package com.expense.expenseService.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Expense {
    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="external_id")
    private String externalId;

    @Column(name="user_id")
    private String userId;

    @Column(name="amount")
    private BigDecimal amount;

    @Column(name = "currency")
    private String currency;

    @Column(name = "merchant")
    private String merchant;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @PrePersist
    @PreUpdate
    private void generateExternalId() {
        if (externalId == null) {
            externalId = UUID.randomUUID().toString();
        }

        if (createdAt == null) {
            createdAt = new Timestamp(System.currentTimeMillis());
        }

        updatedAt = new Timestamp(System.currentTimeMillis());
    }

}
