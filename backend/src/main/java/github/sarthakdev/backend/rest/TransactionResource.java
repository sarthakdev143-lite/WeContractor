package github.sarthakdev.backend.rest;

import github.sarthakdev.backend.model.TransactionDTO;
import github.sarthakdev.backend.service.TransactionService;
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
@RequestMapping(value = "/api/transactions", produces = MediaType.APPLICATION_JSON_VALUE)
public class TransactionResource {

    private final TransactionService transactionService;

    public TransactionResource(final TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDTO> getTransaction(
            @PathVariable(name = "transactionId") final String transactionId) {
        return ResponseEntity.ok(transactionService.get(transactionId));
    }

    @PostMapping
    public ResponseEntity<String> createTransaction(
            @RequestBody @Valid final TransactionDTO transactionDTO) {
        final String createdTransactionId = transactionService.create(transactionDTO);
        return new ResponseEntity<>('"' + createdTransactionId + '"', HttpStatus.CREATED);
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<String> updateTransaction(
            @PathVariable(name = "transactionId") final String transactionId,
            @RequestBody @Valid final TransactionDTO transactionDTO) {
        transactionService.update(transactionId, transactionDTO);
        return ResponseEntity.ok('"' + transactionId + '"');
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable(name = "transactionId") final String transactionId) {
        transactionService.delete(transactionId);
        return ResponseEntity.noContent().build();
    }

}
