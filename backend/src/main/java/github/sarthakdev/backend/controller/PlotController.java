package github.sarthakdev.backend.controller;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import github.sarthakdev.backend.dto.ErrorResponse;
import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.dto.PlotListDTO;
import github.sarthakdev.backend.dto.PlotResponseDTO;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.security.JwtService;
import github.sarthakdev.backend.service.PlotService;
import github.sarthakdev.backend.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plots")
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }, maxAge = 3600)
public class PlotController {

    private final PlotService plotService;
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getAllPlots() {
        System.out.println("\n\nFetching all Plots...\n\n");
        try {
            List<Plot> plots = plotService.getAllPlots();
            System.out.println("\n\nFetched " + plots.size() + " plots.\n\n");
            plots.forEach(plot -> System.out.print(plot.getTitle() + ", "));

            List<PlotResponseDTO> plotResponses = plots.stream()
                    .map(plot -> {
                        return PlotResponseDTO.builder()
                                .id(plot.getId().toString())
                                .image(plot.getImageUrls() != null && !plot.getImageUrls().isEmpty()
                                        ? plot.getImageUrls().get(0)
                                        : "https://via.placeholder.com/500x300")
                                .title(plot.getTitle())
                                .description(plot.getDescription())
                                .location(plot.getLocation())
                                .price(plot.getPrice())
                                .length(plot.getLength())
                                .breadth(plot.getBreadth())
                                .soldBy(plot.getPlotOwner() != null ? plot.getPlotOwner().getFullName() : "Unknown")
                                .rating(calculateAverageRating(plot.getRating()))
                                .dateAdded(plot.getCreatedAt().toString())
                                .tags(plot.getTags() != null ? String.join(", ", plot.getTags()) : "")
                                .plotType(plot.getPlotType())
                                .totalViews(plot.getTotalViews())
                                .build();
                    })
                    .collect(Collectors.toList());

            System.out.println("\n\nReturning Plot Response DTOs: " + plotResponses + "\n\n");
            return ResponseEntity.ok(plotResponses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Failed to fetch plots: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPlot(@Valid @RequestBody PlotListDTO plotListDTO,
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
            Plot savedPlot = plotService.savePlot(plotListDTO, user);
            System.out.println("Saved Plot: " + PlotService.printPlot(savedPlot));

            return ResponseEntity.ok(savedPlot);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("\n\n\nFailed to create plot listing: " + e.getMessage() +
                            " | Cause : " + (e.getCause() != null ? e.getCause().getMessage() : "No cause")));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlot(@PathVariable ObjectId id) {
        try {
            System.out.println("\n\nFetching Plot For ID : " + id);
            PlotDTO plot = plotService.getPlotById(id);
            if (plot == null) {
                return ResponseEntity.notFound().build();
            }
            System.out.println("\nReturning Plot With Title : " + plot.getTitle() + "\n\n");
            return ResponseEntity.ok(plot);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("\n\n\nFailed to fetch plot: " + e.getMessage() +
                            " | Cause : " + (e.getCause() != null ? e.getCause().getMessage()
                                    : "No cause")));
        }
    }

    private double calculateAverageRating(List<Float> ratings) {
        if (ratings == null || ratings.isEmpty())
            return 0.0;

        double sum = 0.0;
        for (Float rating : ratings)
            sum += rating;

        return sum / ratings.size();
    }
}