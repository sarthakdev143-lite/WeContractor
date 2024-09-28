package github.sarthakdev143.backend.rest;

import github.sarthakdev143.backend.model.ContractorDTO;
import github.sarthakdev143.backend.service.ContractorService;
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
@RequestMapping(value = "/api/contractors", produces = MediaType.APPLICATION_JSON_VALUE)
public class ContractorResource {

    private final ContractorService contractorService;

    public ContractorResource(final ContractorService contractorService) {
        this.contractorService = contractorService;
    }

    @GetMapping
    public ResponseEntity<List<ContractorDTO>> getAllContractors() {
        return ResponseEntity.ok(contractorService.findAll());
    }

    @GetMapping("/{contractorId}")
    public ResponseEntity<ContractorDTO> getContractor(
            @PathVariable(name = "contractorId") final Integer contractorId) {
        return ResponseEntity.ok(contractorService.get(contractorId));
    }

    @PostMapping
    public ResponseEntity<Integer> createContractor(
            @RequestBody @Valid final ContractorDTO contractorDTO) {
        final Integer createdContractorId = contractorService.create(contractorDTO);
        return new ResponseEntity<>(createdContractorId, HttpStatus.CREATED);
    }

    @PutMapping("/{contractorId}")
    public ResponseEntity<Integer> updateContractor(
            @PathVariable(name = "contractorId") final Integer contractorId,
            @RequestBody @Valid final ContractorDTO contractorDTO) {
        contractorService.update(contractorId, contractorDTO);
        return ResponseEntity.ok(contractorId);
    }

    @DeleteMapping("/{contractorId}")
    public ResponseEntity<Void> deleteContractor(
            @PathVariable(name = "contractorId") final Integer contractorId) {
        contractorService.delete(contractorId);
        return ResponseEntity.noContent().build();
    }

}
