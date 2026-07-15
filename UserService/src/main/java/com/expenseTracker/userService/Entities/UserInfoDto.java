package com.expenseTracker.userService.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfoDto {

    @NonNull
    private String userId;

    @NonNull
    private String firstName; //first_name

    @NonNull
    private String lastName; //last_name

    @NonNull
    private String email; //email

    private Long phoneNumber; //phone_number

    private String profilePicture;

    public UserInfo convertToUserInfo(){
        return UserInfo.builder()
                .userId(userId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phoneNumber(phoneNumber)
                .profilePicture(profilePicture).build();
    }
}
