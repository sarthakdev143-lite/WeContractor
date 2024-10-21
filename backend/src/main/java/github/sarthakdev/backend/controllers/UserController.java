package github.sarthakdev.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.dto.SignupRequest;
import github.sarthakdev.backend.services.UserService;
import github.sarthakdev.backend.exceptions.UserAlreadyExistsException;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
@RequestMapping("/api/user")
@Validated
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> userSignup(@Validated @RequestBody SignupRequest userDTO) {
        try {
            System.out.println("\n\n\nReceived new signup request for username : " + userDTO.getUsername());
            var newUser = userService.signup(userDTO);
            var response = new SignupResponse("User registered successfully", newUser, true);
            return ResponseEntity.ok(response);
        } catch (UserAlreadyExistsException e) {
            System.out.println("\n\n\nSignup failed : " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new SignupResponse(e.getMessage(), null, false));
        } catch (Exception e) {
            System.out.println("\n\n\nUnexpected error during signup : " + e);
            return ResponseEntity.internalServerError()
                    .body(new SignupResponse("An unexpected error occurred", null, false));
        }
    }
}