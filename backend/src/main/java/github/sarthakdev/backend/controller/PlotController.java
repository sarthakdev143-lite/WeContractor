package github.sarthakdev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import github.sarthakdev.backend.dto.ErrorResponse;
import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.security.JwtService;
import github.sarthakdev.backend.service.PlotService;
import github.sarthakdev.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plots")
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }, maxAge = 3600)
public class PlotController {

    private final PlotService plotService;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> createPlot(@Valid @RequestBody PlotDTO plotDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Authorization Header : " + authHeader);
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("Extracted Token: " + token);
            String username = jwtService.extractUserName(token);
            System.out.println("Extracted Username: " + username);

            User user = userService.findUserByUsername(username);
            System.out.println("User Found: " + UserService.printUserDetails(user));

            // Save the plot
            Plot savedPlot = plotService.savePlot(plotDTO, user);
            System.out.println("Saved Plot: " + PlotService.printPlot(savedPlot));

            return ResponseEntity.ok(savedPlot);
        } catch (Exception e) {
            e.printStackTrace(); // Detailed stack trace for debugging
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("\n\n\nFailed to create plot listing: " + e.getMessage() +
                            " | Cause : " + (e.getCause() != null ? e.getCause().getMessage() : "No cause")));
        }
    }
}
