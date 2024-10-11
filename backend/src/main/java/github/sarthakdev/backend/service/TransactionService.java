package github.sarthakdev.backend.service;

import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.Transaction;
import github.sarthakdev.backend.domain.User;
import github.sarthakdev.backend.model.TransactionDTO;
import github.sarthakdev.backend.repos.PlotRepository;
import github.sarthakdev.backend.repos.TransactionRepository;
import github.sarthakdev.backend.repos.UserRepository;
import github.sarthakdev.backend.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final PlotRepository plotRepository;
    private final UserRepository userRepository;

    public TransactionService(final TransactionRepository transactionRepository,
            final PlotRepository plotRepository, final UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.plotRepository = plotRepository;
        this.userRepository = userRepository;
    }

    public List<TransactionDTO> findAll() {
        final List<Transaction> transactions = transactionRepository.findAll(Sort.by("transactionId"));
        return transactions.stream()
                .map(transaction -> mapToDTO(transaction, new TransactionDTO()))
                .toList();
    }

    public TransactionDTO get(final String transactionId) {
        return transactionRepository.findById(transactionId)
                .map(transaction -> mapToDTO(transaction, new TransactionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final TransactionDTO transactionDTO) {
        final Transaction transaction = new Transaction();
        mapToEntity(transactionDTO, transaction);
        transaction.setTransactionId(transactionDTO.getTransactionId());
        return transactionRepository.save(transaction).getTransactionId();
    }

    public void update(final String transactionId, final TransactionDTO transactionDTO) {
        final Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(transactionDTO, transaction);
        transactionRepository.save(transaction);
    }

    public void delete(final String transactionId) {
        transactionRepository.deleteById(transactionId);
    }

    private TransactionDTO mapToDTO(final Transaction transaction,
            final TransactionDTO transactionDTO) {
        transactionDTO.setTransactionId(transaction.getTransactionId());
        transactionDTO.setTransactionDate(transaction.getTransactionDate());
        transactionDTO.setCreatedAt(transaction.getCreatedAt());
        transactionDTO.setPlot(transaction.getPlot() == null ? null : transaction.getPlot().getPlotId());
        transactionDTO.setBuyer(transaction.getBuyer() == null ? null : transaction.getBuyer().getUserId());
        transactionDTO.setSeller(transaction.getSeller() == null ? null : transaction.getSeller().getUserId());
        return transactionDTO;
    }

    private Transaction mapToEntity(final TransactionDTO transactionDTO,
            final Transaction transaction) {
        transaction.setTransactionDate(transactionDTO.getTransactionDate());
        transaction.setCreatedAt(transactionDTO.getCreatedAt());
        final Plot plot = transactionDTO.getPlot() == null ? null : plotRepository.findById(transactionDTO.getPlot())
                .orElseThrow(() -> new NotFoundException("plot not found"));
        transaction.setPlot(plot);
        final User buyer = transactionDTO.getBuyer() == null ? null : userRepository.findById(transactionDTO.getBuyer())
                .orElseThrow(() -> new NotFoundException("buyer not found"));
        transaction.setBuyer(buyer);
        final User seller = transactionDTO.getSeller() == null ? null : userRepository.findById(transactionDTO.getSeller())
                .orElseThrow(() -> new NotFoundException("seller not found"));
        transaction.setSeller(seller);
        return transaction;
    }

    public boolean transactionIdExists(final String transactionId) {
        return transactionRepository.existsByTransactionIdIgnoreCase(transactionId);
    }

}
