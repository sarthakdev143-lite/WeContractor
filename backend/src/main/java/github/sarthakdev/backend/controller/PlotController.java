package github.sarthakdev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import github.sarthakdev.backend.dto.ErrorResponse;
import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.service.PlotService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plots")
@RequiredArgsConstructor
@CrossOrigin(origins = { "#{@getAllowedOrigins}" }, maxAge = 3600) // Injected CORS origins dynamically
public class PlotController {
    
    private final PlotService plotService;
    
    @PostMapping
    public ResponseEntity<?> createPlot(@Valid @RequestBody PlotDTO plotDTO) {
        try {
            System.out.println("\n\nRequest to save new Plot :-");
            plotService.printPlotDTO(plotDTO);
            Plot savedPlot = plotService.savePlot(plotDTO);
            return ResponseEntity.ok(savedPlot);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to create plot listing: " + e.getMessage()));
        }
    }
}
