package github.sarthakdev143.backend.rest;

import github.sarthakdev143.backend.model.PlotDTO;
import github.sarthakdev143.backend.service.PlotService;
import github.sarthakdev143.backend.util.ReferencedException;
import github.sarthakdev143.backend.util.ReferencedWarning;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/plots", produces = MediaType.APPLICATION_JSON_VALUE)
public class PlotResource {

    private final PlotService plotService;

    public PlotResource(final PlotService plotService) {
        this.plotService = plotService;
    }

    @GetMapping
    public ResponseEntity<List<PlotDTO>> getAllPlots() {
        return ResponseEntity.ok(plotService.findAll());
    }

    @GetMapping("/{plotId}")
    public ResponseEntity<PlotDTO> getPlot(@PathVariable(name = "plotId") final Integer plotId) {
        return ResponseEntity.ok(plotService.get(plotId));
    }

    @PostMapping
    public ResponseEntity<Integer> createPlot(@RequestBody @Valid final PlotDTO plotDTO) {
        final Integer createdPlotId = plotService.create(plotDTO);
        return new ResponseEntity<>(createdPlotId, HttpStatus.CREATED);
    }

    @PutMapping("/{plotId}")
    public ResponseEntity<Integer> updatePlot(@PathVariable(name = "plotId") final Integer plotId,
            @RequestBody @Valid final PlotDTO plotDTO) {
        plotService.update(plotId, plotDTO);
        return ResponseEntity.ok(plotId);
    }

    @DeleteMapping("/{plotId}")
    public ResponseEntity<Void> deletePlot(@PathVariable(name = "plotId") final Integer plotId) {
        final ReferencedWarning referencedWarning = plotService.getReferencedWarning(plotId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        plotService.delete(plotId);
        return ResponseEntity.noContent().build();
    }

}
