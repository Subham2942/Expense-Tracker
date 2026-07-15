package expenseTracker.AuthService.controller;


import expenseTracker.AuthService.entities.RefreshToken;
import expenseTracker.AuthService.eventProducer.UserInfoProducer;
import expenseTracker.AuthService.models.UserInfoDto;
import expenseTracker.AuthService.response.JWTResponseDTO;
import expenseTracker.AuthService.service.JwtService;
import expenseTracker.AuthService.service.RefreshTokenService;
import expenseTracker.AuthService.service.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class AuthController
{

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private final UserInfoProducer userInfoProducer;

    @PostMapping("auth/v1/signup")
    public ResponseEntity SignUp(@RequestBody UserInfoDto userInfoDto){
        try{
            Boolean isSignedUp = userDetailsService.signupUser(userInfoDto);
            if(Boolean.FALSE.equals(isSignedUp)){
                return new ResponseEntity<>("Already Exist", HttpStatus.BAD_REQUEST);
            }
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userInfoDto.getUsername());
            String jwtToken = jwtService.GenerateToken(userInfoDto.getUsername());

            return new ResponseEntity<>(JWTResponseDTO.builder().accessToken(jwtToken).
                    refreshToken(refreshToken.getToken()).build(), HttpStatus.OK);

        }catch (Exception ex){
            ex.printStackTrace();
            return new ResponseEntity<>("Exception in User Service: " + ex.getMessage()  ,  HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
