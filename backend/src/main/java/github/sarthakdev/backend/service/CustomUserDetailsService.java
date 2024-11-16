package github.sarthakdev.backend.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
                System.out.println("Load user by username or email: " + usernameOrEmail);
                User user = userRepository.findByUsername(usernameOrEmail)
                                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                                                .orElseThrow(() -> new UsernameNotFoundException(
                                                                "User not found with username or email: "
                                                                                + usernameOrEmail)));

                System.out.printf("User found :-\n%s\n\n", UserService.printUserDetails(user));

                return org.springframework.security.core.userdetails.User.builder()
                                .username(user.getUsername())
                                .password(user.getPassword())
                                .authorities(user.getRoles().stream()
                                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                                                .toList())
                                .build();
        }
}
