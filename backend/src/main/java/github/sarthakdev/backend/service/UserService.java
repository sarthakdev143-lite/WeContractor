package github.sarthakdev.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import github.sarthakdev.backend.dto.LoginRequest;
import github.sarthakdev.backend.dto.SignupRequest;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.exception.UserAlreadyExistsException;
import github.sarthakdev.backend.model.Role;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.model.VerificationToken;
import github.sarthakdev.backend.repository.RoleRepository;
import github.sarthakdev.backend.repository.UserRepository;
import github.sarthakdev.backend.repository.VerificationTokenRepository;
import github.sarthakdev.backend.security.JwtService;
import github.sarthakdev.backend.security.TbConstants;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public SignupResponse signup(@Validated SignupRequest userDTO) {
        validateNewUser(userDTO);

        User tempUser = mapToUser(userDTO);
        tempUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        tempUser.setEnabled(false);

        // Assign roles immediately after user creation
        List<Role> roles = determineUserRoles();
        tempUser.setRoles(roles);

        // Create verification token
        VerificationToken verificationToken = new VerificationToken(tempUser);

        // Save temporary user and token
        User savedTempUser = userRepository.save(tempUser);
        tokenRepository.save(verificationToken);

        // Send verification email
        try {
            emailService.sendVerificationEmail(tempUser.getEmail(), verificationToken.getToken());
            return new SignupResponse("Verification email sent. Please check your inbox.", savedTempUser, true);
        } catch (MessagingException e) {
            // Cleanup if email sending fails
            userRepository.delete(savedTempUser);
            tokenRepository.delete(verificationToken);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Transactional
    public String verifyEmail(String token) {
        System.out.println("\n\nReceived new verification request :- \n" + token + "\n\n");
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    System.out.println("\n\nVerification token not found.");
                    throw new IllegalArgumentException("Invalid verification token");
                });

        if (verificationToken.getConfirmedAt() != null) {
            System.out.println("\n\nVerification token already confirmed.");
            throw new IllegalStateException("Email already verified");
        }

        LocalDateTime expiredAt = verificationToken.getExpiresAt();
        if (expiredAt.isBefore(LocalDateTime.now())) {
            System.out.println("\n\nVerification token expired.");
            throw new IllegalStateException("Token expired");
        }

        verificationToken.setConfirmedAt(LocalDateTime.now());
        User user = verificationToken.getTempUser();
        user.setEnabled(true);
        System.out.println("\n\nEmail verified Successfully..!!\n\n");

        // Roles are already assigned, just save the updated user status
        userRepository.save(user);
        tokenRepository.save(verificationToken);

        return "Email verified successfully";
    }

    private List<Role> determineUserRoles() {
        List<Role> roles = new ArrayList<>();

        if (userRepository.count() == 0) {
            roles.addAll(createInitialRoles());
            System.out.println("\n\nFirst User Detected! Created Roles for Him/Her.");
        } else {
            Optional<Role> userRole = Optional.of(roleRepository.findByName(TbConstants.Roles.USER));
            if (userRole.isEmpty()) {
                // If USER role doesn't exist, create it
                Role newUserRole = new Role();
                newUserRole.setId(TbConstants.Roles.USER);
                newUserRole.setName(TbConstants.Roles.USER);
                roles.add(roleRepository.save(newUserRole));
                System.out.println("\n\nCreated and assigned new USER role");
            } else {
                roles.add(userRole.get());
                System.out.println("\n\nAssigned existing USER role to new user");
            }
        }

        return roles;
    }

    // Rest of the methods remain unchanged...
    private void validateNewUser(SignupRequest userDTO) {
        userRepository.findByUsername(userDTO.getUsername())
                .ifPresent(user -> {
                    System.out.println(
                            "\n\nWARNING: Attempted to create account with existing username: "
                                    + userDTO.getUsername());
                    throw new UserAlreadyExistsException("Username '" + userDTO.getUsername() + "' already exists.");
                });

        userRepository.findByEmail(userDTO.getEmail())
                .ifPresent(user -> {
                    System.out.println("\n\nWARNING: Attempted to create account with existing email: "
                            + userDTO.getEmail());
                    throw new UserAlreadyExistsException("Email '" + userDTO.getEmail() + "' is already registered.");
                });

        userRepository.findByPhoneNumber(userDTO.getPhoneNumber())
                .ifPresent(user -> {
                    System.out.println("\n\nWARNING: Attempted to create account with existing phone number: "
                            + userDTO.getPhoneNumber());
                    throw new UserAlreadyExistsException(
                            "Phone number '" + userDTO.getPhoneNumber() + "' is already registered.");
                });
    }

    private List<Role> createInitialRoles() {
        List<Role> roles = new ArrayList<>();

        Role adminRole = new Role();
        adminRole.setId(TbConstants.Roles.ADMIN);
        adminRole.setName(TbConstants.Roles.ADMIN);
        roles.add(roleRepository.save(adminRole));

        Role userRole = new Role();
        userRole.setId(TbConstants.Roles.USER);
        userRole.setName(TbConstants.Roles.USER);
        roles.add(roleRepository.save(userRole));

        System.out.println("\n\nNew roles created and added to the set: " + roles);
        return roles;
    }

    private User mapToUser(SignupRequest userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
        return user;
    }

    public String verifyUser(LoginRequest userDTO) {
        System.out.println("\n\n\nReceived new login request :- \n" + userDTO.toString() + "\n\n");
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDTO.getIdentifier(),
                        userDTO.getPassword()));

        if (authentication.isAuthenticated()) {
            System.out.println("\n\nUser authenticated successfully: " + userDTO.getIdentifier() + "\n");
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userDTO.getIdentifier());
            System.out.println("\n\nUser details loaded successfully: " + userDetails.getUsername()
                    + "\n\nGenerating Token..\n\n");
            return jwtService.generateToken(userDetails);
        }

        System.out.println("\n\nFailed to Generate Token\n\n");
        return "Failed to generate token";
    }
}