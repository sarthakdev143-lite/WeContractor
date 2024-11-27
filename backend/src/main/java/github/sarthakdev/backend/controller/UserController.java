package github.sarthakdev.backend.controller;

import github.sarthakdev.backend.dto.UserDashboardResponse;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.service.UserService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@Validated
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }, maxAge = 3600)
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDashboardResponse> getUser() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("\n\nFetching dashboard data for user : " + username + "\n\n");

        try {
            UserDashboardResponse dashboardData = userService.getUserDashboardData(username);
            System.out.println("\n\nDashboard data: " + dashboardData + "\n\n");
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            System.out.println("\n\nError fetching dashboard data: " + e.getMessage() + "\n\n");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/plots")
    public ResponseEntity<List<Plot>> getUserPlots() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("\n\nFetching plots for user : " + username + "\n\n");

        try {
            List<Plot> plots = userService.getUserPlots(username);
            System.out.println("\n\nPlots :-\n" + plots + "\n\n");
            return ResponseEntity.ok(plots);
        } catch (Exception e) {
            System.out.println("\n\nError fetching plots: " + e.getMessage() + "\n\n");
            return ResponseEntity.internalServerError().build();
        }
    }

}
