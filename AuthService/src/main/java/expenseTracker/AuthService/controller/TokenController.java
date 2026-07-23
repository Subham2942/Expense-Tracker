package expenseTracker.AuthService.controller;

import expenseTracker.AuthService.entities.RefreshToken;
import expenseTracker.AuthService.request.AuthRequestDTO;
import expenseTracker.AuthService.request.RefreshTokenDTO;
import expenseTracker.AuthService.response.JWTResponseDTO;
import expenseTracker.AuthService.service.JwtService;
import expenseTracker.AuthService.service.RefreshTokenService;
import expenseTracker.AuthService.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Objects;

@Controller
public class TokenController
{

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;


    @PostMapping("auth/v1/login")
    public ResponseEntity AuthenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        if(authentication.isAuthenticated()){
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getUsername());
            return new ResponseEntity<>(JWTResponseDTO.builder()
                    .accessToken(jwtService.GenerateToken(authRequestDTO.getUsername()))
                    .refreshToken(refreshToken.getToken())
                    .build(), HttpStatus.OK);

        } else {
            return new ResponseEntity<>("Exception in User Service", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("auth/v1/refreshToken")
    public ResponseEntity<JWTResponseDTO> refreshToken(@RequestBody RefreshTokenDTO refreshTokenRequestDTO){
        try {
            return refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUserInfo)
                    .map(userInfo -> ResponseEntity.ok(JWTResponseDTO.builder()
                            .accessToken(jwtService.GenerateToken(userInfo.getUsername()))
                            .refreshToken(refreshTokenRequestDTO.getToken())
                            .build()))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("auth/v1/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshTokenDTO refreshTokenRequestDTO) {
        refreshTokenService.revokeRefreshToken(refreshTokenRequestDTO.getToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/auth/v1/ping")
    public ResponseEntity<String> ping() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String userId = userDetailsService.getUserByUsername(authentication.getName());
            if(Objects.nonNull(userId)){
                return ResponseEntity.ok(userId);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

}
