package expenseTracker.AuthService.models;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import expenseTracker.AuthService.entities.UserInfo;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDto extends UserInfo {

    @NonNull
    private String firstName; //first_name
    @NonNull
    private String lastName; //last_name
    @NonNull
    private String email; //email
    private Long phoneNumber; //phone_number
}
