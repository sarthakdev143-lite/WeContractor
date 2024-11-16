package github.sarthakdev.backend.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.security.auth.login.AccountLockedException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import github.sarthakdev.backend.dto.SecureLoginRequest;
import github.sarthakdev.backend.dto.SignupRequest;
import github.sarthakdev.backend.dto.SignupResponse;
import github.sarthakdev.backend.dto.UserDashboardResponse;
import github.sarthakdev.backend.exception.UserAlreadyExistsException;
import github.sarthakdev.backend.model.LoginVerificationToken;
import github.sarthakdev.backend.model.Role;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.model.VerificationToken;
import github.sarthakdev.backend.repository.LoginVerificationTokenRepository;
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
    private final JwtService jwtService;
    private final LoginVerificationTokenRepository loginVerificationTokenRepository;
    private final LoginAttemptService loginAttemptService;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public SignupResponse signup(@Validated SignupRequest userDTO) {
        validateNewUser(userDTO);

        User tempUser = mapToUser(userDTO);
        tempUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        tempUser.setEnabled(false);

        // Assign roles immediately after user creation
        List<Role> roles = determineUserRoles(tempUser);
        tempUser.setRoles(roles);

        // Create verification token
        VerificationToken verificationToken = new VerificationToken(tempUser);

        // Save temporary user and token
        User savedTempUser = userRepository.save(tempUser);
        tokenRepository.save(verificationToken);

        // Send verification email
        try {
            System.out.println("\n\nSending new Verification Email for: " + tempUser + "\n\nVerification Link : "
                    + frontendUrl + "/?token=" + verificationToken.getToken() + "\n\n");
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
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return "Email verified successfully";
    }

    public String initiateLogin(SecureLoginRequest request, String ipAddress, String userAgent) {
        System.out.println("\n\nInitiating Login for: " + request + "\n\n");

        // Retrieve user by email or username
        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if the account is locked
        try {
            loginAttemptService.checkLoginAttempts(user);
        } catch (AccountLockedException e) {
            e.printStackTrace();
        } // Throws AccountLockedException if locked

        // Ensure the account is enabled
        if (!user.getEnabled()) {
            throw new RuntimeException("Account not verified");
        }

        // Verify the password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            try {
                loginAttemptService.recordFailedAttempt(user);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            userRepository.save(user);
            throw new RuntimeException("Invalid credentials");
        }

        // Generate a unique login token
        String token = UUID.randomUUID().toString();
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // Create a new LoginVerificationToken
        LoginVerificationToken loginToken = new LoginVerificationToken(
                token, user.getEmail(), passwordHash, ipAddress, userAgent); // Use user's email here

        // Remove any existing unconfirmed tokens for this user
        loginVerificationTokenRepository.findByEmail(user.getEmail())
                .ifPresent(loginVerificationTokenRepository::delete);

        // Save the new token
        loginVerificationTokenRepository.save(loginToken);

        // Generate the login link
        String loginLink = frontendUrl + "/form/login/verify-login?token=" + token;
        System.out.println("\n\nLogin Link : " + loginLink + "\n\n");

        System.out.println("\n\nSending Login Link...");
        // Send the login link to the user's email
        try {
            emailService.sendLoginLink(user.getEmail(), loginLink); // Always send to user's email
            System.out.println("\n\nLogin Link Sent Successfully!!!...\nUser who Initiated login :-\n"
                    + printUserDetails(user) + "\n\n");
            return "Login verification link sent to your email";
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send login verification email", e);
        }
    }

    @Transactional
    public String verifyLoginToken(String token, String ipAddress, String userAgent) {
        LoginVerificationToken loginToken = loginVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid login token"));

        // Validate token
        if (loginToken.getConfirmedAt() != null) {
            throw new IllegalStateException("Token already used");
        }

        if (loginToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expired");
        }

        // Verify IP and User Agent for additional security
        if (!loginToken.getIpAddress().equals(ipAddress) ||
                !loginToken.getUserAgent().equals(userAgent)) {
            loginToken.setAttempts(loginToken.getAttempts() + 1);
            loginVerificationTokenRepository.save(loginToken);
            throw new SecurityException("Security verification failed");
        }

        // Mark token as confirmed
        loginToken.setConfirmedAt(LocalDateTime.now());
        loginVerificationTokenRepository.save(loginToken);

        // Get user and reset login attempts
        User user = userRepository.findByEmail(loginToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        loginAttemptService.resetAttempts(user);
        userRepository.save(user);

        // Generate JWT token with additional claims
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("ip", ipAddress);
        extraClaims.put("loginTime", LocalDateTime.now().toString());

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtService.generateToken(extraClaims, userDetails);

        System.out.println("\n\nSending Login Notification...");
        // Send login notification
        try {
            emailService.sendLoginNotification(user.getEmail(), ipAddress, userAgent);
            System.out.println(
                    "\n\nLogin Notification Sent Successfully!!..\nUser who Verified login :-\n"
                            + printUserDetails(user) + "\n\n");
        } catch (MessagingException e) {
            throw new RuntimeException("\n\nFailed to send login notification", e);
        }

        return jwtToken;
    }

    public static String printUserDetails(User user) {
        StringBuilder userDetails = new StringBuilder();
        userDetails.append("====================================\n");
        userDetails.append("Full Name   : ").append(user.getFullName()).append("\n");
        userDetails.append("Username    : ").append(user.getUsername()).append("\n");
        userDetails.append("Email       : ").append(user.getEmail()).append("\n");
        userDetails.append("Password    : ").append(user.getPassword()).append("\n");
        userDetails.append("Phone Number: ").append(user.getPhoneNumber()).append("\n");
        userDetails.append("Role (s)        : ").append(user.getRoles().get(0).getName()).append("\n");
        userDetails.append("Status      : ").append(user.getStatus() != null ? user.getStatus() : "N/A").append("\n");
        userDetails.append("Verified    : ").append(user.getVerified() ? "Yes" : "No").append("\n");
        userDetails.append("Enabled     : ").append(user.getEnabled() ? "Yes" : "No").append("\n");
        userDetails.append("Profile Picture URL  : ").append(user.getProfilePictureUrl()).append("\n");
        userDetails.append("====================================\n");
        return userDetails.toString();
    }

    private List<Role> determineUserRoles(User tempUser) {
        List<Role> roles = new ArrayList<>();

        if (userRepository.count() == 0) {
            roles.addAll(createInitialRoles());
            tempUser.setVerified(true);
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
        user.setFullName(userDTO.getFullName());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
        return user;
    }

    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboardData(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDashboardResponse userDashboardResponse = new UserDashboardResponse();
        userDashboardResponse.setFullName(user.getFullName());
        userDashboardResponse.setUsername(user.getUsername());
        userDashboardResponse.setEmail(user.getEmail());
        userDashboardResponse.setPhoneNumber(user.getPhoneNumber());
        userDashboardResponse.setVerified(user.getVerified());
        userDashboardResponse.setStatus(user.getStatus());
        userDashboardResponse.setCreatedAt(user.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
        userDashboardResponse.setProfilePictureUrl(user.getProfilePictureUrl());
        userDashboardResponse.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .toList());

        return userDashboardResponse;
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("\n\nUser not found with username : " + username));
    }
}