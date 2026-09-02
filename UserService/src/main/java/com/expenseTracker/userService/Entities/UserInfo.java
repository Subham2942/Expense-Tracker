package com.expenseTracker.userService.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfo{

    @Id
    @Column(name = "user_id")
    private String userId;

    @NonNull
    private String firstName; //first_name

    @NonNull
    private String lastName; //last_name

    @NonNull
    private String email; //email

    private Long phoneNumber; //phone_number


    private String profilePicture;

}
