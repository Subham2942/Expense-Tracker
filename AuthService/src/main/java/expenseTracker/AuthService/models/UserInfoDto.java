package expenseTracker.AuthService.models;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import expenseTracker.AuthService.entities.UserInfo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDto extends UserInfo {

    @NotBlank(message = "firstName is required")
    private String firstName; //first_name
    @NotBlank(message = "lastName is required")
    private String lastName; //last_name
    @NotBlank(message = "email is required")
    @Email
    private String email; //email
    private Long phoneNumber; //phone_number
}
