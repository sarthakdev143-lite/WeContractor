package github.sarthakdev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.exception.UserAlreadyExistsException;
import github.sarthakdev.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import github.sarthakdev.backend.dto.ApiResponse;
import github.sarthakdev.backend.dto.LoginRequest;
import github.sarthakdev.backend.dto.LoginResponse;
import github.sarthakdev.backend.dto.SignupRequest;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }) // Injected CORS origins dynamically
public class UserController {

    private final UserService userService;

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

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@Validated @RequestBody LoginRequest userDTO) {
        System.out.println("\n\n\nReceived new login request :- \n" + userDTO.toString() + "\n\n");
        String token = userService.verifyUser(userDTO);
        if (token.equals("failed to generate token")) {
            System.out.println("\n\n\nLogin failed." + "\n\nFinal Response :- \n" + token + "\n\n");
            return ResponseEntity.badRequest().body(new LoginResponse(token, false, null));
        }
        var response = new LoginResponse("User logged in successfully.", true, token);
        System.out.println("Final Response :- \n" + response + "\n\n");
        return ResponseEntity.ok(response);
    }
}
