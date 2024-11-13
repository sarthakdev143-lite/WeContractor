package github.sarthakdev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.exception.UserAlreadyExistsException;
import github.sarthakdev.backend.security.JwtService;
import github.sarthakdev.backend.service.CustomUserDetailsService;
import github.sarthakdev.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import github.sarthakdev.backend.dto.ApiResponse;
import github.sarthakdev.backend.dto.LoginResponse;
import github.sarthakdev.backend.dto.SecureLoginRequest;
import github.sarthakdev.backend.dto.SignupRequest;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }, maxAge = 3600) // Injected CORS origins dynamically
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        try {
            String result = userService.verifyEmail(token);
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid verification token"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> userSignup(@Validated @RequestBody SignupRequest userDTO) {
        try {
            System.out.println("\n\n\nReceived new signup request :- \n" + userDTO.toString() + "\n\n");
            SignupResponse signupResponse = userService.signup(userDTO);
            System.out.println("Final Response :- \n" + signupResponse + "\n\n");
            return ResponseEntity.ok(signupResponse);
        } catch (UserAlreadyExistsException e) {
            System.out.println(
                    "\n\n\nSignup failed." + "\n\nFinal Response :- \n" + e.getMessage() + "\n\nLocalized Message : "
                            + e.getLocalizedMessage() + "\n\nCause : " + e.getCause() + "\n\n");

            return ResponseEntity.badRequest()
                    .body(new SignupResponse(e.getMessage(), null, false));
        } catch (Exception e) {
            System.out.println(
                    "\n\n\nUnexpected error during signup" + "\n\nFinal Response :- \n" + e.getMessage() + "\n\n"
                            + "\n\nLocalized Message : "
                            + e.getLocalizedMessage() + "\n\nCause : " + e.getCause() + "\n\n");
            return ResponseEntity.internalServerError()
                    .body(new SignupResponse("An unexpected error occurred", null, false));
        }
    }

    @PostMapping("/initiate-login")
    public ResponseEntity<?> initiateLogin(
            @Valid @RequestBody SecureLoginRequest request,
            HttpServletRequest servletRequest) {
        System.out.println("\n\nInitiating Login\n\n");
        try {
            String ipAddress = getClientIp(servletRequest);
            String userAgent = servletRequest.getHeader("User-Agent");
            System.out.println("\n\nIp-Address : " + ipAddress + "\nUser Agent : " + userAgent + "\n\n");

            String result = userService.initiateLogin(request, ipAddress, userAgent);
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(
            @RequestParam("token") String token,
            HttpServletRequest servletRequest) {
        System.out.println("\n\nVerifying Login\n\n");
        try {
            String ipAddress = getClientIp(servletRequest);
            String userAgent = servletRequest.getHeader("User-Agent");
            System.out.println("\n\nToken : " + token + "\nIp-Address : " + ipAddress + "\nUser Agent : " + userAgent + "\n\n");

            String jwtToken = userService.verifyLoginToken(token, ipAddress, userAgent);
            return ResponseEntity.ok(new LoginResponse("Login successful", true, jwtToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(e.getMessage(), false, null));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            System.out.println("\n\nReturning Client's IP : " + xfHeader.split(",")[0]);
            return xfHeader.split(",")[0];
        } else {
            System.out.println("\n\nReturning Client's IP : " + request.getRemoteAddr());
            return request.getRemoteAddr();
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Authorization header
            System.out.println("\n\n\nReceived new token validation request :- \n" + authHeader + "\n\n");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("\n\n\nToken validation failed. Invalid authorization header.\n\n");
                return ResponseEntity.status(401)
                        .body(new ApiResponse(false, "Invalid authorization header", null));
            }

            String token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("\n\n\nReceived new token :- \n" + token + "\n\n");

            // Extract username from token
            String username = jwtService.extractUserName(token);
            System.out.println("\n\n\nExtracted username :- \n" + username + "\n\n");

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            System.out.println("\n\n\nUser details :- \n" + userDetails + "\n\n");

            boolean isValid = jwtService.isTokenValid(token, userDetails);
            System.out.println("\n\n\nToken validation result :- \n" + isValid + "\n\n");

            if (isValid) {
                System.out.println("\n\n\nToken is valid.\n\n");
                return ResponseEntity.ok()
                        .body(new ApiResponse(true, "Token is valid", null));
            } else {
                System.out.println("\n\n\nToken is invalid.\n\n");
                return ResponseEntity.status(401)
                        .body(new ApiResponse(false, "Token is invalid", null));
            }

        } catch (Exception e) {
            System.out.println("\n\n\nToken validation failed. Unexpected error occurred.\n\nFinal Response :- \n"
                    + e.getMessage() + "\n\nLocalized Message : " + e.getLocalizedMessage() + "\n\nCause : "
                    + e.getCause() + "\n\n");
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Token validation failed", e.getMessage()));
        }
    }
}
