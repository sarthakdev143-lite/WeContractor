package github.sarthakdev.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import github.sarthakdev.backend.beans.Role;
import github.sarthakdev.backend.beans.User;
import github.sarthakdev.backend.dto.SignupRequest;
import github.sarthakdev.backend.exceptions.UserAlreadyExistsException;
import github.sarthakdev.backend.repositories.RoleRepository;
import github.sarthakdev.backend.repositories.UserRepository;
import github.sarthakdev.backend.security.TbConstants;

@Service
@Validated
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User signup(@Validated SignupRequest userDTO) {
        System.out.println("\n\nProcessing signup request for user: " + userDTO.getUsername());

        // Check for existing users with same username or email
        validateNewUser(userDTO);

        User newUser = mapToUser(userDTO);
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        System.out
                .println("\n\nUser's Password is Encoded Successfully to : " + '"' + newUser.getPassword() + '"');

        List<Role> roles = determineUserRoles();
        newUser.setRoles(roles);
        System.out.println("\n\nRoles assigned to user Successfully : " + newUser.getRoles());

        System.out.println("\n\nAttempting To Save User To DB...");
        User savedUser = userRepository.save(newUser);
        System.out.println("\n\nUser successfully registered: " + savedUser.getUsername() + "\n");
        return savedUser;
    }

    private void validateNewUser(SignupRequest userDTO) {
        userRepository.findByUsername(userDTO.getUsername())
                .ifPresent(user -> {
                    System.out.println(
                            "\n\nWARNING: Attempted to create account with existing username: "
                                    + userDTO.getUsername());
                    throw new UserAlreadyExistsException("Username already exists.");
                });

        userRepository.findByEmail(userDTO.getEmail())
                .ifPresent(user -> {
                    System.out
                            .println("\n\nWARNING: Attempted to create account with existing email: "
                                    + userDTO.getEmail());
                    throw new UserAlreadyExistsException("Email already registered.");
                });

        userRepository.findByPhoneNumber(userDTO.getPhoneNumber())
                .ifPresent(user -> {
                    System.out
                            .println("\n\nWARNING: Attempted to create account with existing phone number: "
                                    + userDTO.getPhoneNumber());
                    throw new UserAlreadyExistsException("Phone number already registered.");
                });
    }

    private List<Role> determineUserRoles() {
        List<Role> roles = new ArrayList<>();

        if (userRepository.count() == 0) {
            roles.addAll(createInitialRoles());
            System.out.println("\n\nFirst User Detected! Created Roles for Him/Her.");
        } else {
            Optional<Role> userRole = Optional.of(roleRepository.findByName(TbConstants.Roles.USER));
            if (userRole.isEmpty()) {
                System.out.println("\n\nERROR: Required USER role not found in database");
                throw new IllegalStateException("Required USER role not found");
            }
            roles.add(userRole.get());
            System.out.println("\n\nAssigned USER role to new user");
        }

        return roles;
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
}