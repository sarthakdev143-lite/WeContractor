package github.sarthakdev.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.exception.UserAlreadyExistsException;
import github.sarthakdev.backend.service.UserService;
import github.sarthakdev.backend.dto.SignupRequest;

@RestController
@RequestMapping("/api/user")
@Validated
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }) // Injected CORS origins dynamically
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> userSignup(@Validated @RequestBody SignupRequest userDTO) {
        try {
            System.out.println("\n\n\nReceived new signup request :- \n" + userDTO.toString() + "\n\n");
            var newUser = userService.signup(userDTO);
            var response = new SignupResponse("User registered successfully.", newUser, true);
            System.out.println("Final Response :- \n" + response + "\n\n");
            return ResponseEntity.ok(response);
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
}
